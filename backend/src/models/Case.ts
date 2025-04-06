import mongoose, { Schema, Document } from 'mongoose';

export interface ICase extends Document {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  documents: {
    name: string;
    uri: string;
    mimeType: string;
    size: number;
  }[];
  analysis: {
    summary: string;
    details: string;
    recommendations: string[];
    references: {
      id: string;
      title: string;
      description: string;
    }[];
    outcomes: {
      id: string;
      scenario: string;
      probability: number;
      reasoning: string;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  documents: [{
    name: String,
    uri: String,
    mimeType: String,
    size: Number
  }],
  analysis: {
    summary: String,
    details: String,
    recommendations: [String],
    references: [{
      id: String,
      title: String,
      description: String
    }],
    outcomes: [{
      id: String,
      scenario: String,
      probability: Number,
      reasoning: String
    }]
  }
}, {
  timestamps: true
});

export default mongoose.model<ICase>('Case', CaseSchema); 