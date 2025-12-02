import express from 'express';
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} from '../controllers/assessmentTemplate.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();
// All routes require authentication
router.use(authMiddleware);

// Create new template
router.post('/', createTemplate);

// Get all templates for user
router.get('/', getTemplates);

// Get template by ID
router.get('/:id', getTemplateById);

// Update template
router.put('/:id', updateTemplate);

// Delete template
router.delete('/:id', deleteTemplate);

export default router;
