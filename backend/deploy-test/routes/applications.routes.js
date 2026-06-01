"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applications_controller_1 = require("../controllers/applications.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/jobs/:jobId/apply', auth_middleware_1.authenticate, applications_controller_1.applyToJob);
router.get('/mine', auth_middleware_1.authenticate, applications_controller_1.getMyApplications);
exports.default = router;
