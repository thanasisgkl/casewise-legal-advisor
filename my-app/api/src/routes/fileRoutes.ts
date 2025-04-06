import express from 'express';
import { FileController } from '../controllers/fileController';
import { FileService } from '../services/fileService';

const router = express.Router();

// Ανέβασμα αρχείου
router.post('/:caseId/upload', 
  FileService.uploadFile(),
  FileController.uploadFile
);

// Ανάλυση αρχείου
router.post('/:caseId/documents/:documentId/analyze', 
  FileController.analyzeFile
);

// Λήψη αποτελεσμάτων ανάλυσης
router.get('/:caseId/documents/:documentId/analysis', 
  FileController.getAnalysis
);

export default router; 