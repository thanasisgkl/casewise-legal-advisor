import express from 'express';
import {
  getAllCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase
} from '../controllers/caseController';

const router = express.Router();

// Get all cases
router.get('/', getAllCases);

// Get single case
router.get('/:id', getCaseById);

// Create new case
router.post('/', createCase);

// Update case
router.put('/:id', updateCase);

// Delete case
router.delete('/:id', deleteCase);

export default router; 