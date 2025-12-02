import prisma from "../../db.config.js";
import bcrypt from "bcrypt";

export const changePassword = async (email, currentPassword, newPassword) => {
  // Get user with password
  const user = await prisma.user.findFirst({
    where: { email },
    select: { id: true, password: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  return { message: 'Password changed successfully' };
};
