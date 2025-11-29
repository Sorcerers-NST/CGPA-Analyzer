import bcrypt from 'bcrypt';
import prisma from '../../db.config.js';
import { sendPasswordResetEmail } from '../utils/sendEmail.js';

/**
 * Generate a random 6-digit numeric code
 * @returns {string} 6-digit code
 */
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Request password reset - Step 1
 * POST /api/auth/forgot-password
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset code has been sent.',
      });
    }

    // Generate 6-digit code
    const resetCode = generateResetCode();
    
    // Set expiration to 5 minutes from now
    const resetExpires = new Date(Date.now() + 5 * 60 * 1000);

    // Save code and expiration to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode,
        resetExpires,
      },
    });

    // Send email with code
    try {
      await sendPasswordResetEmail(email, resetCode, user.username);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      
      // Clear the reset code since email failed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetCode: null,
          resetExpires: null,
        },
      });

      return res.status(500).json({
        success: false,
        error: 'Failed to send password reset email. Please try again later.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset code has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing your request',
    });
  }
};

/**
 * Reset password with code - Step 2
 * POST /api/auth/reset-password
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Validate input
    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email, code, and new password are required',
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or code',
      });
    }

    // Check if reset code exists
    if (!user.resetCode || !user.resetExpires) {
      return res.status(400).json({
        success: false,
        error: 'No password reset request found. Please request a new code.',
      });
    }

    // Check if code matches
    if (user.resetCode !== code) {
      return res.status(400).json({
        success: false,
        error: 'Invalid code',
      });
    }

    // Check if code is expired
    if (new Date() > new Date(user.resetExpires)) {
      // Clear expired code
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetCode: null,
          resetExpires: null,
        },
      });

      return res.status(400).json({
        success: false,
        error: 'Reset code has expired. Please request a new code.',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetExpires: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while resetting your password',
    });
  }
};
