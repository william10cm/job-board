import { Router } from 'express';
import {
  getAllJobs, getJobById, searchJobs
} from '../controllers/jobs.controller';

const router = Router();

router.get('/search', searchJobs);
router.get('/', getAllJobs);
router.get('/:id', getJobById);


export default router;