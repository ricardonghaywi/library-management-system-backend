import { Schema, Document } from 'mongoose';
import { Role } from 'src/utils/roles';

export interface CMSUser extends Document {
  email: string;
  fullname: string;
  role: Role.intern | Role.administrator;
  createdAt: Date;
  updatedAt: Date;
}

export const CMSUserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: [Role.intern, Role.administrator],
      required: [true, 'Role is required'],
      default: 'intern',
    },
  },
  {
    timestamps: true,
  },
);
