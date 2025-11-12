import express from "express";
import * as semesterController from "../controllers/semester.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All semester routes are protected with JWT authentication
router.use(authMiddleware);

/**
 * @route   POST /api/v1/semesters/
 * @desc    Create a new semester for the logged-in user
 * @access  Private (JWT required)
 * @body    { semesterNumber: Number, startDate?: Date, endDate?: Date }
 */
router.post("/", semesterController.createSemester);

/**
 * @route   GET /api/v1/semesters/
 * @desc    Get all semesters for the logged-in user
 * @access  Private (JWT required)
 */
router.get("/", semesterController.getAllSemesters);

/**
 * @route   GET /api/v1/semesters/:id
 * @desc    Get a single semester by ID with all subjects
 * @access  Private (JWT required)
 */
router.get("/:id", semesterController.getSemesterById);

/**
 * @route   PUT /api/v1/semesters/:id
 * @desc    Update semester data (number, dates, etc.)
 * @access  Private (JWT required)
 * @body    { semesterNumber?: Number, startDate?: Date, endDate?: Date }
 */
router.put("/:id", semesterController.updateSemester);

/**
 * @route   DELETE /api/v1/semesters/:id
 * @desc    Delete a semester and all its subjects
 * @access  Private (JWT required)
 */
router.delete("/:id", semesterController.deleteSemester);

/**
 * @route   GET /api/v1/semesters/:id/cgpa
 * @desc    Calculate CGPA/SGPA for a semester based on subjects
 * @access  Private (JWT required)
 */
router.get("/:id/cgpa", semesterController.calculateSemesterCGPA);

export default router;
