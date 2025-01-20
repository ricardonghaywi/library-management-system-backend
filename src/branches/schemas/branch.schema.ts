import { Schema, Document } from 'mongoose';

export interface Branch extends Document {
  branchName: string;
  location: {
    address: string;
    city: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const BranchSchema = new Schema(
  {
    branchName: {
      type: String,
      required: [true, 'Branch name is required'],
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);
