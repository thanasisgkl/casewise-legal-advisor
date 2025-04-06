import { Request, Response } from 'express';
import Case from '../models/Case';

// Get all cases
export const getAllCases = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cases', error });
  }
};

// Get single case by ID
export const getCaseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const caseId = req.params.id;
    const caseItem = await Case.findById(caseId);
    
    if (!caseItem) {
      res.status(404).json({ message: 'Case not found' });
      return;
    }
    
    res.json(caseItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching case', error });
  }
};

// Create new case
export const createCase = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCase = new Case(req.body);
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    res.status(400).json({ message: 'Error creating case', error });
  }
};

// Update case
export const updateCase = async (req: Request, res: Response): Promise<void> => {
  try {
    const caseId = req.params.id;
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCase) {
      res.status(404).json({ message: 'Case not found' });
      return;
    }
    
    res.json(updatedCase);
  } catch (error) {
    res.status(400).json({ message: 'Error updating case', error });
  }
};

// Delete case
export const deleteCase = async (req: Request, res: Response): Promise<void> => {
  try {
    const caseId = req.params.id;
    const deletedCase = await Case.findByIdAndDelete(caseId);
    
    if (!deletedCase) {
      res.status(404).json({ message: 'Case not found' });
      return;
    }
    
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting case', error });
  }
}; 