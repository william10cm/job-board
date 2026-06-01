import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/pool';

import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/jobs.routes';
import companyRoutes from './routes/companies.routes';
import applicationRoutes from './routes/applications.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  `https://${process.env.CLOUDFRONT_DOMAIN}`,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});