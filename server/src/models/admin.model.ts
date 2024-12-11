// src/models/Admin.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface Admin {
  email: string;
  password: string;
  name?: string;
  superAdmin?: boolean;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminDocument extends Admin, Document {}

const adminSchema = new Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    superAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Admin = mongoose.model<AdminDocument>('Admin', adminSchema);

export default Admin;
