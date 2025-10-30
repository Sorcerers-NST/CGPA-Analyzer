import express from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";

const router = express.Router();

router.use("/api/users", userRouter);
router.use("/api/auth", authRouter);

export default router;
