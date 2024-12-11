import { Admin } from "./admin.types";
export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  status: string;
  category: string;
  author: Admin;
  created_at: string;
  updated_at: string;
  __v: number;
}
export interface BlogResponse {
  blogs: Blog[];
  currentPage: number | null;
  totalBlogs: number | null;
  totalPages: number | null;
}
