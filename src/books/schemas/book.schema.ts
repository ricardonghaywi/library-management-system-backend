import { Schema, Types } from 'mongoose';
import { Document } from 'mongoose';

export interface Book extends Document {
  title: {
    en: string;
    ar?: string;
  };
  isbn: string;
  genre: string;
  description: {
    en: string;
    ar?: string;
  };
  numberOfAvailableCopies: number;
  isBorrowable: boolean;
  numberOfBorrowableDays?: number;
  isOpenToReviews: boolean;
  minAge: number;
  authorId: string;
  coverImageUrl?: string;
  publishedDate: Date;
  isPublished: boolean;
  branchInventory: {
    branchId: Types.ObjectId;
    totalCopies: number;
    availableCopies: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export const BookSchema = new Schema(
  {
    title: {
      en: {
        type: String,
        required: [true, 'English title is required'],
      },
      ar: {
        type: String,
        required: false, // Arabic title is optional
      },
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      match: [/^ISBN\s\d{3}-\d-\d{2,5}-\d{2,7}-\d$/, 'Invalid ISBN format'],
    },
    genre: { type: String, required: [true, 'Genre is required'] },
    description: {
      en: {
        type: String,
        required: [true, 'English description is required'],
      },
      ar: {
        type: String,
        required: false, // Arabic description is optional
      },
    },
    numberOfAvailableCopies: {
      type: Number,
      required: [true, 'Number of available copies is required'],
      min: [0, 'Number of available copies cannot be less than 0'],
    },
    isBorrowable: { type: Boolean, default: true },
    numberOfBorrowableDays: {
      type: Number,
      required: function () {
        return this.isBorrowable;
      },
      min: [1, 'Number of borrowable days must be at least 1'],
    },
    isOpenToReviews: { type: Boolean, default: true },
    minAge: {
      type: Number,
      required: [true, 'Minimum age is required'],
      min: [0, 'Minimum age cannot be less than 0'],
    },
    authorId: {
      type: Types.ObjectId,
      ref: 'Author',
      required: [true, 'Author ID is required'],
    },
    coverImageUrl: { type: String },
    publishedDate: {
      type: Date,
      required: [true, 'Published date is required'],
    },
    isPublished: { type: Boolean, default: false },
    branchInventory: [
      {
        branchId: {
          type: Types.ObjectId,
          ref: 'Branch',
          required: true,
        },
        totalCopies: {
          type: Number,
          required: [true, 'Total copies are required'],
          min: [0, 'Total copies cannot be less than 0'],
        },
        availableCopies: {
          type: Number,
          required: [true, 'Available copies are required'],
          min: [0, 'Available copies cannot be less than 0'],
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);
