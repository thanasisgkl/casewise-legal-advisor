import mongoose, { Document, Schema, Types } from 'mongoose';

// Interfaces
interface IDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  fileUrl: string;
  uploadDate: Date;
  type: string;
}

interface INote extends Document {
  _id: Types.ObjectId;
  content: string;
  createdAt: Date;
  createdBy: string;
}

interface ICase extends Document {
  title: string;
  description: string;
  clientName: string;
  caseNumber: string;
  status: 'pending' | 'active' | 'closed';
  filingDate: Date;
  courtDetails: {
    court: string;
    department?: string;
    judge?: string;
  };
  documents: IDocument[];
  notes: INote[];
  nextHearing?: Date;
  createdAt: Date;
  updatedAt: Date;
  statistics: {
    totalDocuments: number;
    totalNotes: number;
    lastActivity: Date;
  };
  addDocument(doc: Partial<IDocument>): Promise<ICase>;
  addNote(note: Partial<INote>): Promise<ICase>;
}

// Ορισμός του σχήματος για τα έγγραφα
const DocumentSchema = new Schema<IDocument>({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  type: { type: String, required: true }
}, { _id: true });

// Ορισμός του σχήματος για τις σημειώσεις
const NoteSchema = new Schema<INote>({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true }
}, { _id: true });

// Το κύριο σχήμα της υπόθεσης
const CaseSchema = new Schema<ICase>({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  clientName: { 
    type: String, 
    required: true,
    index: true
  },
  caseNumber: { 
    type: String, 
    required: true,
    unique: true,
    index: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'closed'],
    default: 'pending' 
  },
  filingDate: { 
    type: Date, 
    required: true 
  },
  courtDetails: {
    court: { type: String, required: true },
    department: String,
    judge: String
  },
  documents: [DocumentSchema],
  notes: [NoteSchema],
  nextHearing: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  statistics: {
    totalDocuments: { type: Number, default: 0 },
    totalNotes: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  }
});

// Middleware για αυτόματη ενημέρωση του updatedAt
CaseSchema.pre('save', function(this: ICase, next) {
  this.updatedAt = new Date();
  
  // Ενημέρωση στατιστικών
  if (this.statistics) {
    this.statistics.totalDocuments = this.documents.length;
    this.statistics.totalNotes = this.notes.length;
    this.statistics.lastActivity = new Date();
  }
  
  next();
});

// Μέθοδοι του μοντέλου
CaseSchema.methods.addDocument = function(this: ICase, doc: Partial<IDocument>): Promise<ICase> {
  this.documents.push(doc as IDocument);
  return this.save();
};

CaseSchema.methods.addNote = function(this: ICase, note: Partial<INote>): Promise<ICase> {
  this.notes.push(note as INote);
  return this.save();
};

// Στατικές μέθοδοι
CaseSchema.statics.findByClient = function(clientName: string): Promise<ICase[]> {
  return this.find({ clientName: new RegExp(clientName, 'i') });
};

CaseSchema.statics.findActiveCases = function(): Promise<ICase[]> {
  return this.find({ status: 'active' });
};

// Εξαγωγή του μοντέλου
export const Case = mongoose.model<ICase>('Case', CaseSchema); 