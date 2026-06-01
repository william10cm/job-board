import { Router } from 'express';
import { applyToJob, getMyApplications } from '../controllers/applications.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/jobs/:jobId/apply', authenticate, applyToJob);
router.get('/mine', authenticate, getMyApplications);

export default router;