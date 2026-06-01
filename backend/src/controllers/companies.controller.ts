import { Request, Response } from 'express';
import { z } from 'zod';
import pool from '../db/pool';

const companySchema = z.object({
  name: z.string().min(2),
  location: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
});

export const getAllCompanies = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM companies ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await pool.query(
      'SELECT * FROM companies WHERE id = $1', [req.params.id]
    );
    if (company.rows.length === 0) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }
    const jobs = await pool.query(
      'SELECT * FROM jobs WHERE company_id = $1 AND is_active = true ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json({ ...company.rows[0], jobs: jobs.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCompany = async (req: Request, res: Response): Promise<void> => {
  const parsed = companySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const result = await pool.query(
      `INSERT INTO companies (name, location, website, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [parsed.data.name, parsed.data.location, parsed.data.website, parsed.data.description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};