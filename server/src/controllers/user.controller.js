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
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};
