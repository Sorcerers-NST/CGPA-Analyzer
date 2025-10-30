import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", authMiddleware, getUser);

export default userRouter;
