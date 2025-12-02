import express from "express";
import * as semesterController from "../controllers/semester.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All semester routes are protected with JWT authentication
router.use(authMiddleware);

router.post("/", semesterController.createSemester);

router.get("/", semesterController.getAllSemesters);

router.get("/:id", semesterController.getSemesterById);

router.put("/:id", semesterController.updateSemester);

router.delete("/:id", semesterController.deleteSemester);

router.get("/:id/cgpa", semesterController.calculateSemesterCGPA);

export default router;
