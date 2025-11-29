import express from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import collegeRouter from "./college.routes.js";
import semesterRouter from "./semester.routes.js";
import subjectRouter from "./subject.routes.js";
import passwordResetRouter from "./passwordReset.routes.js";

const router = express.Router();

router.use("/api/users", userRouter);
router.use("/api/auth", authRouter);
router.use("/api/auth", passwordResetRouter);
router.use("/api/colleges", collegeRouter);
router.use("/api/v1/semesters", semesterRouter);
router.use("/api/v1/subjects", subjectRouter);

export default router;
