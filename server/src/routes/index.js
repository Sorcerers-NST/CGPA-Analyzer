import express from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import collegeRouter from "./college.routes.js";
import semesterRouter from "./semester.routes.js";
import subjectRouter from "./subject.routes.js";
import passwordResetRouter from "./passwordReset.routes.js";
import assessmentTemplateRouter from "./assessmentTemplate.routes.js";
import assessmentScoreRouter from "./assessmentScore.routes.js";
import predictorRouter from "./predictor.routes.js";

const router = express.Router();

router.use("/api/users", userRouter);
router.use("/api/auth", authRouter);
router.use("/api/auth", passwordResetRouter);
router.use("/api/colleges", collegeRouter);
router.use("/api/v1/semesters", semesterRouter);
router.use("/api/v1/subjects", subjectRouter);
router.use("/api/assessment-templates", assessmentTemplateRouter);
router.use("/api/assessment-scores", assessmentScoreRouter);
router.use("/api/v1/predictor", predictorRouter);

export default router;
