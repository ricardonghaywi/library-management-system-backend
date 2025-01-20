import { Schema, Types, Document } from 'mongoose';

export interface BorrowedBook {
  borrowedBookId: Types.ObjectId;
  branchId: string;
  borrowedDate: Date;
  returnDate?: Date;
}

export interface Member extends Document {
  name: string;
  username: string;
  password: string;
  email: string;
  birthDate: Date;
  subscribedBooks: Types.ObjectId[];
  borrowedBooks: BorrowedBook[];
  returnRate: number;
  numberOfBooksReturnedOnTime: number;
  emailVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const MemberSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: [true, 'Birth date is required'],
    },
    subscribedBooks: [
      {
        type: Types.ObjectId,
        ref: 'Book',
      },
    ],
    borrowedBooks: [
      {
        borrowedBookId: {
          type: Types.ObjectId,
          ref: 'Book',
          required: true,
        },
        branchId: {
          type: String,
          ref: 'Branch',
          required: true,
        },
        borrowedDate: {
          type: Date,
          required: [true, 'Borrowed date is required'],
        },
        returnDate: {
          type: Date,
        },
      },
    ],
    returnRate: {
      type: Number,
      min: [0, 'Return rate cannot be negative'],
      max: [100, 'Return rate cannot exceed 100'],
      default: 0,
    },
    numberOfBooksReturnedOnTime: {
      type: Number,
      min: 0,
      default: 0,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);
