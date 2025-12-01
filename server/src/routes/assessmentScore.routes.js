import express from 'express';
import {
  createSubjectAssessment,
  addScore,
  getScoresBySubject,
  getPredictionsBySemester
} from '../controllers/assessmentScore.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();
// All routes require authentication
router.use(authenticateToken);

// Create subject assessment (link subject to template)
router.post('/subject-assessment', createSubjectAssessment);

// Add or update score
router.post('/', addScore);

// Get scores for a subject
router.get('/subject/:subjectId', getScoresBySubject);

// Get all predictions for a semester
router.get('/predictions/:semesterId', getPredictionsBySemester);

export default router;
