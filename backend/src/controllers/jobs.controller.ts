import { Request, Response } from 'express';
import { z } from 'zod';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth.middleware';

const jobSchema = z.object({
  company_id: z.string().uuid(),
  title: z.string().min(2),
  location: z.string().optional(),
  job_type: z.enum(['full-time', 'part-time', 'contract', 'remote']).default('full-time'),
  description: z.string().min(10),
});

export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT j.*, c.name as company_name, c.location as company_location
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.is_active = true
       ORDER BY j.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT j.*, c.name as company_name, c.website as company_website,
              c.description as company_description
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.id = $1 AND j.is_active = true`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = jobSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { company_id, title, location, job_type, description } = parsed.data;

  try {
    const result = await pool.query(
      `INSERT INTO jobs (company_id, title, location, job_type, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [company_id, title, location, job_type, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      'UPDATE jobs SET is_active = false WHERE id = $1',
      [req.params.id]
    );
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const searchJobs = async (req: Request, res: Response): Promise<void> => {
  const { q, job_type, location } = req.query;

  try {
    let query = `
      SELECT j.*, c.name as company_name, c.location as company_location
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.is_active = true
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (q && typeof q === 'string' && q.trim()) {
      query += ` AND j.search_vector @@ plainto_tsquery('english', $${paramIndex})`;
      params.push(q.trim());
      paramIndex++;
    }

    if (job_type && typeof job_type === 'string') {
      query += ` AND j.job_type = $${paramIndex}`;
      params.push(job_type);
      paramIndex++;
    }

    if (location && typeof location === 'string' && location.trim()) {
      query += ` AND j.location ILIKE $${paramIndex}`;
      params.push(`%${location.trim()}%`);
      paramIndex++;
    }

    query += ` ORDER BY j.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};