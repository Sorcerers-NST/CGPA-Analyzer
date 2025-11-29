import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/passwordReset.controller.js';

const router = express.Router();

/**
 * Password Reset Routes
 * These routes handle the password reset flow using email verification codes
 */

// POST /api/auth/forgot-password - Request password reset code
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password - Verify code and reset password
router.post('/reset-password', resetPassword);

export default router;
