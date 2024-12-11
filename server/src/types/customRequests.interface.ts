import { Request } from 'express';

export interface AuthRequest extends Request {
  username?: string;
  email: string;
  password: string;
}

export interface UserRequest extends Request {
  user?: {
    email: string;
  };
}

export interface BlogRequest extends Request {
  image?: Express.Multer.File[];
}

export interface BlogQueryParams {
  page: string;
  limit: string;
  status?: string;
  category?: string;
  title?: string;
  sortByDate?: string;
}
