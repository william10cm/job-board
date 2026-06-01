"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyApplications = exports.applyToJob = void 0;
const zod_1 = require("zod");
const pool_1 = __importDefault(require("../db/pool"));
const applicationSchema = zod_1.z.object({
    cover_letter: zod_1.z.string().optional(),
});
const applyToJob = async (req, res) => {
    const parsed = applicationSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        const result = await pool_1.default.query(`INSERT INTO applications (job_id, user_id, cover_letter)
       VALUES ($1, $2, $3) RETURNING *`, [req.params.jobId, req.userId, parsed.data.cover_letter]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        if (err.code === '23505') {
            res.status(409).json({ error: 'You have already applied to this job' });
            return;
        }
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.applyToJob = applyToJob;
const getMyApplications = async (req, res) => {
    try {
        const result = await pool_1.default.query(`SELECT a.*, j.title as job_title, c.name as company_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.user_id = $1
       ORDER BY a.applied_at DESC`, [req.userId]);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getMyApplications = getMyApplications;
