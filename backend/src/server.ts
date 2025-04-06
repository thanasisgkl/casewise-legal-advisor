import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';

// Import routes
import caseRoutes from './routes/caseRoutes';

const app = express();
const port = process.env.PORT ?? 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/casewise';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/cases', caseRoutes);

// Basic route
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to CaseWise API' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 