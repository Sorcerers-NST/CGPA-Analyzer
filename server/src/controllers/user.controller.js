import prisma from "../../db.config.js";

export const getUser = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const email = req.user.email;

    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        username: true,
        email: true,
        collegeId: true,
        college: { select: { id: true, name: true } },
        profileCompleted: true,
        bio: true,
        university: true,
        graduationYear: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const formatted = {
      username: user.username,
      email: user.email,
      collegeId: user.collegeId ? user.collegeId.toString() : null,
      college: user.college ? { id: user.college.id.toString(), name: user.college.name } : null,
      profileCompleted: user.profileCompleted,
      bio: user.bio,
      university: user.university,
      graduationYear: user.graduationYear,
    };

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUserCollege = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const email = req.user.email;
    const { collegeId } = req.body;

    if (!collegeId) {
      return res.status(400).json({ error: 'collegeId is required' });
    }

    const college = await prisma.college.findUnique({ where: { id: BigInt(collegeId) } }).catch(() => null);
    if (!college) {
      return res.status(400).json({ error: 'Invalid collegeId' });
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { collegeId: BigInt(collegeId) },
      select: { username: true, email: true, collegeId: true, college: { select: { id: true, name: true } } },
    });

    const formatted = {
      username: updated.username,
      email: updated.email,
      collegeId: updated.collegeId ? updated.collegeId.toString() : null,
      college: updated.college ? { id: updated.college.id.toString(), name: updated.college.name } : null,
    };

    return res.json({ user: formatted });
  } catch (err) {
    console.error('Error updating user college:', err);
    return res.status(500).json({ error: 'Unable to update college' });
  }
};

export const completeProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const email = req.user.email;
    const { username, bio, university, graduationYear } = req.body;

    if (!username || !university) {
      return res.status(400).json({ error: 'Username and university are required' });
    }

    // Check if username is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: { 
        username,
        NOT: { email }
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { 
        username,
        bio: bio || null,
        university: university || null,
        graduationYear: graduationYear || null,
        profileCompleted: true
      },
      select: { 
        username: true, 
        email: true, 
        collegeId: true, 
        college: { select: { id: true, name: true } },
        profileCompleted: true,
        bio: true,
        university: true,
        graduationYear: true,
      },
    });

    const formatted = {
      username: updated.username,
      email: updated.email,
      collegeId: updated.collegeId ? updated.collegeId.toString() : null,
      college: updated.college ? { id: updated.college.id.toString(), name: updated.college.name } : null,
      profileCompleted: updated.profileCompleted,
      bio: updated.bio,
      university: updated.university,
      graduationYear: updated.graduationYear,
    };

    return res.json({ user: formatted, message: 'Profile completed successfully' });
  } catch (err) {
    console.error('Error completing profile:', err);
    return res.status(500).json({ error: 'Unable to complete profile' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const email = req.user.email;

    // Get user with ID
    const user = await prisma.user.findFirst({
      where: { email },
      select: { id: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = user.id;

    // Delete all user data in transaction
    await prisma.$transaction(async (tx) => {
      // Delete CGPARecords
      await tx.cGPARecord.deleteMany({
        where: { userId }
      });

      // Delete Leaderboard entries
      await tx.leaderboard.deleteMany({
        where: { userId }
      });

      // Get all semesters to delete subjects
      const semesters = await tx.semester.findMany({
        where: { userId },
        select: { id: true }
      });

      const semesterIds = semesters.map(s => s.id);

      // Delete all subjects in all semesters
      if (semesterIds.length > 0) {
        await tx.subject.deleteMany({
          where: { semesterId: { in: semesterIds } }
        });
      }

      // Delete all semesters
      await tx.semester.deleteMany({
        where: { userId }
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId }
      });
    });

    // Clear cookie
    res.clearCookie('jwt', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });

    return res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err);
    return res.status(500).json({ error: 'Unable to delete account' });
  }
};
