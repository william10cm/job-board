"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompany = exports.getCompanyById = exports.getAllCompanies = void 0;
const zod_1 = require("zod");
const pool_1 = __importDefault(require("../db/pool"));
const companySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    location: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional(),
    description: zod_1.z.string().optional(),
});
const getAllCompanies = async (_req, res) => {
    try {
        const result = await pool_1.default.query('SELECT * FROM companies ORDER BY name ASC');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getAllCompanies = getAllCompanies;
const getCompanyById = async (req, res) => {
    try {
        const company = await pool_1.default.query('SELECT * FROM companies WHERE id = $1', [req.params.id]);
        if (company.rows.length === 0) {
            res.status(404).json({ error: 'Company not found' });
            return;
        }
        const jobs = await pool_1.default.query('SELECT * FROM jobs WHERE company_id = $1 AND is_active = true ORDER BY created_at DESC', [req.params.id]);
        res.json({ ...company.rows[0], jobs: jobs.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getCompanyById = getCompanyById;
const createCompany = async (req, res) => {
    const parsed = companySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        const result = await pool_1.default.query(`INSERT INTO companies (name, location, website, description)
       VALUES ($1, $2, $3, $4) RETURNING *`, [parsed.data.name, parsed.data.location, parsed.data.website, parsed.data.description]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.createCompany = createCompany;
