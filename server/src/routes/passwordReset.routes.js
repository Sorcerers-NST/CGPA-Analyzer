import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/passwordReset.controller.js';

const router = express.Router();

// POST /api/auth/forgot-password - Request password reset code
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password - Verify code and reset password
router.post('/reset-password', resetPassword);

export default router;
