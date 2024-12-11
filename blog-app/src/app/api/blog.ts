import axios from "axios";

const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
console.log("PUBLIC_URL", PUBLIC_URL);
export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  status: string;
  category: string;
  author: {
    email: string;
    name?: string;
  };
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface BlogResponse {
  blogs: Blog[];
  currentPage: number;
  totalBlogs: number;
  totalPages: number;
}
export const fetchBlogs = async (
  page: number = 1,
  limit: number = 6,
  category?: string | null
): Promise<BlogResponse> => {
  try {
    const response = await axios.get(`${PUBLIC_URL}/api/blogs/`, {
      params: { page, limit, category },
    });
    return response.data as BlogResponse;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const fetchBlogById = async (id: string) => {
  try {
    const response = await axios.get(`${PUBLIC_URL}/api/blog/${id}`);
    return response.data as Blog;
  } catch (error) {
    console.error("Error fetching blog by id:", error);
    throw error;
  }
};
