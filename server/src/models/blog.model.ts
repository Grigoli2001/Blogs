import mongoose, { Document, Schema } from 'mongoose';

interface IBlog {
  title: string;
  content: string;
  image: string | null;
  status: 'active' | 'inactive';
  category: 'company' | 'product' | 'design' | 'engineering' | 'other';
  author: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlogDocument extends IBlog, Document {}

const blogSchema = new Schema<BlogDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    category: {
      type: String,
      enum: ['company', 'product', 'design', 'engineering', 'other'],
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Blog = mongoose.model<BlogDocument>('Blog', blogSchema);

export default Blog;
