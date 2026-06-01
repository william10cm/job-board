import { Router } from 'express';
import {
  getAllJobs, getJobById, createJob, deleteJob, searchJobs
} from '../controllers/jobs.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/search', searchJobs);
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', authenticate, createJob);
router.delete('/:id', authenticate, deleteJob);


export default router;