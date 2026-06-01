import { Request, Response } from 'express';
import { z } from 'zod';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth.middleware';

const applicationSchema = z.object({
  cover_letter: z.string().optional(),
});

export const applyToJob = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO applications (job_id, user_id, cover_letter)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.params.jobId, req.userId, parsed.data.cover_letter]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'You have already applied to this job' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT a.*, j.title as job_title, c.name as company_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.user_id = $1
       ORDER BY a.applied_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};