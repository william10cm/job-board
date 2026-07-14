import { Request, Response } from 'express';
import pool from '../db/pool';

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