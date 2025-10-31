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
