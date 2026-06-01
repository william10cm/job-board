"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pool_1 = __importDefault(require("./db/pool"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const jobs_routes_1 = __importDefault(require("./routes/jobs.routes"));
const companies_routes_1 = __importDefault(require("./routes/companies.routes"));
const applications_routes_1 = __importDefault(require("./routes/applications.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/jobs', jobs_routes_1.default);
app.use('/api/companies', companies_routes_1.default);
app.use('/api/applications', applications_routes_1.default);
app.get('/health', async (_req, res) => {
    try {
        await pool_1.default.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    }
    catch {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});
const allowedOrigins = [
    'http://localhost:5173',
    `https://${process.env.CLOUDFRONT_DOMAIN}`,
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
