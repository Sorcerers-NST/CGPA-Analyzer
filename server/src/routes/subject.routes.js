import { Router } from "express";
import {
  createSubject,
  getSubjectsBySemester,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// All subject routes require authentication
router.use(authMiddleware);

// Create a new subject
router.post("/", createSubject);

// Get all subjects for a specific semester
router.get("/semester/:semesterId", getSubjectsBySemester);

// Get a single subject by ID
router.get("/:id", getSubjectById);

// Update a subject
router.put("/:id", updateSubject);

// Delete a subject
router.delete("/:id", deleteSubject);

export default router;
