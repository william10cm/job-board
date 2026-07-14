import { Router } from 'express';
import { getAllCompanies, getCompanyById, createCompany } from '../controllers/companies.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);

export default router;