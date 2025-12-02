import express from 'express';
const router = express.Router();
import {
  getAllPredictors,
  getPredictorById,
  createPredictor,
  updatePredictor,
  deletePredictor,
} from '../controllers/predictor.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

// All routes require authentication
router.use(authMiddleware);

// Get all predictors for the user
router.get('/', getAllPredictors);

// Get a specific predictor
router.get('/:id', getPredictorById);

// Create a new predictor
router.post('/', createPredictor);

// Update a predictor
router.put('/:id', updatePredictor);

// Delete a predictor
router.delete('/:id', deletePredictor);

export default router;
