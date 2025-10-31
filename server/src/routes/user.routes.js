import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUser, updateUserCollege } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", authMiddleware, getUser);
userRouter.patch('/me/college', authMiddleware, updateUserCollege);

export default userRouter;
