import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUser, updateUserCollege, completeProfile } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", authMiddleware, getUser);
userRouter.patch('/me/college', authMiddleware, updateUserCollege);
userRouter.put('/complete-profile', authMiddleware, completeProfile);

export default userRouter;
