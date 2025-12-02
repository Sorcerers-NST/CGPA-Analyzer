import prisma from "../../db.config.js";
import bcrypt from "bcrypt";
import { sendPasswordChangeVerificationEmail } from "../utils/sendEmail.js";

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const requestPasswordChangeCode = async (email, currentPassword) => {
  // Get user with password
  const user = await prisma.user.findFirst({
    where: { email },
    select: { id: true, password: true, username: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  // Generate 6-digit code
  const verificationCode = generateVerificationCode();
  
  // Set expiration to 5 minutes from now
  const codeExpires = new Date(Date.now() + 5 * 60 * 1000);

  // Save code and expiration to database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetCode: verificationCode,
      resetExpires: codeExpires,
    },
  });

  // Send email with verification code
  try {
    await sendPasswordChangeVerificationEmail(email, verificationCode, user.username);
    console.log(`✅ Verification code sent to ${email}: ${verificationCode}`);
  } catch (emailError) {
    console.error('❌ Failed to send email:', emailError.message);
    console.log(`⚠️  EMAIL NOT CONFIGURED - Verification code for ${email}: ${verificationCode}`);
    console.log('⚠️  Copy this code for testing or configure email settings in .env');
    // Don't throw error - allow password change to work without email for testing
  }

  return { message: 'Verification code sent to your email' };
};

export const verifyCodeAndChangePassword = async (email, code, newPassword) => {
  // Get user
  const user = await prisma.user.findFirst({
    where: { email },
    select: { id: true, resetCode: true, resetExpires: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Check if verification code exists
  if (!user.resetCode || !user.resetExpires) {
    throw new Error('No verification code found. Please request a new code.');
  }

  // Check if code matches
  if (user.resetCode !== code) {
    throw new Error('Invalid verification code');
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

    throw new Error('Verification code has expired. Please request a new code.');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear verification fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetCode: null,
      resetExpires: null,
    },
  });

  return { message: 'Password changed successfully' };
};
