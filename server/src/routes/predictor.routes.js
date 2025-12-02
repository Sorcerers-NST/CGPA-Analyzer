const express = require('express');
const router = express.Router();
const {
  getAllPredictors,
  getPredictorById,
  createPredictor,
  updatePredictor,
  deletePredictor,
} = require('../controllers/predictor.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

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

module.exports = router;
