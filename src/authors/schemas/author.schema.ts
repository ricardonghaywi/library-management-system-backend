import { Schema, Document } from 'mongoose';

export interface Author extends Document {
  name: { en: string; ar: string };
  email: string;
  biography: { en: string; ar: string };
  profileImageUrl: string;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const AuthorSchema = new Schema<Author>({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  biography: {
    en: { type: String },
    ar: { type: String },
  },
  profileImageUrl: { type: String },
  birthDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
