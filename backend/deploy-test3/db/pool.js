"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isLocalDb = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5433,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' || !isLocalDb
        ? { rejectUnauthorized: false }
        : false,
});
pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
});
exports.default = pool;
