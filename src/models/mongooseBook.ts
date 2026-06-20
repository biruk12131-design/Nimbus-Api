import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  publicationDate: Date;
  price: number;
  genre: string;
  stock: number;
  description: string;
  tags: string[];
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  price: { type: Number, required: true },
  genre: { type: String, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  tags: { type: [String], default: [] }
}, {
  timestamps: true
});

export const MongooseBook = mongoose.model<IBook>('Book', BookSchema);
