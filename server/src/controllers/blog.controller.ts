import { Response, Request } from 'express';
import BlogModel from '../models/blog.model';
import statusCodes from '../constants/statusCodes';
import logger from '../middlewares/winston';
import { BlogDocument } from '../models/blog.model';
import {
  BlogRequest,
  BlogQueryParams,
} from '../types/customRequests.interface';
import { firebaseUpload, validateFiles } from '../utils/firebase.utils';

const createBlog = async (req: BlogRequest, res: Response): Promise<void> => {
  const { title, content, category, status = 'inactive' } = req.body;

  let firebaseImageURL = '';
  let file;
  if (req.files && Object.keys(req.files).length > 0) {
    const files = req.files;
    if (Array.isArray(files)) {
      file = files[0];
    } else if (files && typeof files === 'object') {
      file = files[Object.keys(files)[0]][0];
    }

    logger.info('file provided', file);
  }

  if (!title || !content || !category) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'title, category and content are required' });
    return;
  }

  if (title.length < 3) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'title must be at least 3 characters' });
    return;
  }
  if (content.length < 3) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'content must be at least 3 characters' });
    return;
  }
  if (title.length > 120) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'title must be at most 120 characters' });
    return;
  }

  if (content.length > 5000) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'content must be at most 5000 characters' });
    return;
  }

  try {
    if (file) {
      const validateRes = await validateFiles([file]);
      logger.info('file validated');
      logger.info(JSON.stringify(validateRes));
      logger.info('Uploading image to firebase');
      const uploadRes = await firebaseUpload(
        file as Express.Multer.File,
        req.session.user._id,
        'blog',
      );

      firebaseImageURL = uploadRes.media;
    }

    const newBlog = new BlogModel({
      title,
      content,
      image: firebaseImageURL,
      status,
      category,
      author: req.session.user._id,
    });

    const savedBlog: BlogDocument = await (
      await newBlog.populate('author', { password: 0 })
    ).save();
    // Then populate the author field
    // const populatedBlog = await BlogModel.findById(savedBlog._id).populate(
    //   'author',
    //   { password: 0 },
    // );
    res.status(statusCodes.success).json(savedBlog);
  } catch (error) {
    logger.error(error);
    res.status(statusCodes.badRequest).json({ error: 'Error creating blog' });
    return;
  }
};

const editBlog = async (req: BlogRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content, category, status = 'inactive' } = req.body;
  let firebaseImageURL = '';
  let file;
  logger.info('data' + title + +content + category + status);
  if (req.files && Object.keys(req.files).length > 0) {
    const files = req.files;

    if (Array.isArray(files)) {
      file = files[0];
    } else if (files && typeof files === 'object') {
      file = files[Object.keys(files)[0]][0];
    }
    logger.info('file provided', file);
  }

  // don't need to check for title and content since they are not required for editing
  if (title && title.length < 3) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'title must be at least 3 characters' });
    return;
  }
  if (content && content.length < 3) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'content must be at least 3 characters' });
    return;
  }
  if (title && title.length > 120) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'title must be at most 120 characters' });
    return;
  }

  if (content && content.length > 5000) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'content must be at most 5000 characters' });
    return;
  }

  try {
    if (file) {
      const validateRes = await validateFiles([file]);
      logger.info('file validated');
      logger.info(JSON.stringify(validateRes));
      logger.info('Uploading image to firebase');
      const uploadRes = await firebaseUpload(
        file as Express.Multer.File,
        req.session.user._id,
        'blog',
      );

      firebaseImageURL = uploadRes.media;
    }

    const blog = await BlogModel.findById(id);
    if (!blog) {
      res.status(statusCodes.notFound).json({ error: 'Blog not found' });
      return;
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = firebaseImageURL || blog.image;
    blog.status = status || blog.status;
    blog.category = category || blog.category;

    const savedBlog: BlogDocument = await blog.save();
    res.status(statusCodes.success).json(savedBlog);
  } catch (error) {
    logger.error(error);
    res.status(statusCodes.badRequest).json({ error: 'Error editing blog' });
    return;
  }
};

const toggleBlogStatus = async (
  req: BlogRequest,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const blog = await BlogModel.findById(id);
    if (!blog) {
      res.status(statusCodes.notFound).json({ error: 'Blog not found' });
      return;
    }

    blog.status = status
      ? status
      : blog.status === 'active'
        ? 'inactive'
        : 'active';
    const savedBlog: BlogDocument = await blog.save();
    res.status(statusCodes.success).json(savedBlog);
  } catch (error) {
    logger.error(error);
    res
      .status(statusCodes.badRequest)
      .json({ error: 'Error toggling blog status' });
    return;
  }
};

const getBlogsForAdmin = async (
  req: Request<unknown, unknown, unknown, BlogQueryParams>,
  res: Response,
): Promise<void> => {
  const {
    page = 1,
    limit = 6,
    status,
    title,
    category,
    sortByDate = 'desc',
  } = req.query;

  const filters: { [key: string]: unknown } = {};
  if (status) {
    filters.status = status;
  }
  if (title) {
    filters.title = { $regex: title, $options: 'i' }; // Case-insensitive search
  }
  if (category) {
    filters.category = category;
  }

  try {
    const totalBlogs = await BlogModel.countDocuments(filters);
    let blogs = await BlogModel.find(filters)
      .populate('author', { password: 0 })
      .sort({
        updated_at: sortByDate === 'desc' ? -1 : 1,
      })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const blogsWithImages = blogs.filter(
      (blog) => blog.image && blog.image !== '',
    );
    const blogsWithoutImages = blogs.filter(
      (blog) => !blog.image || blog.image === '',
    );

    blogs = [
      ...blogsWithImages.slice(0, 2),
      ...blogsWithoutImages,
      ...blogsWithImages.slice(2),
    ];

    res.status(statusCodes.success).json({
      totalBlogs,
      totalPages: Math.ceil(totalBlogs / +limit),
      currentPage: +page,
      blogs,
    });
  } catch (error) {
    logger.error(error);
    res.status(statusCodes.queryError).json({ error: 'Error fetching blogs' });
  }
};

const getBlogById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const blog = await BlogModel.findById(id).populate('author', {
      password: 0,
    });
    if (!blog) {
      res.status(statusCodes.notFound).json({ error: 'Blog not found' });
      return;
    }
    res.status(statusCodes.success).json(blog);
  } catch (error) {
    logger.error(error);
    res.status(statusCodes.queryError).json({ error: 'Error fetching blog' });
  }
};

// get all blogs for the frontend with infinite scroll
const getBlogs = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 6, category } = req.query;
  const filters: { [key: string]: unknown } = {};
  filters.status = 'active';
  if (category) {
    filters.category = category;
  }

  try {
    const totalBlogs = await BlogModel.countDocuments(filters);
    const blogs = await BlogModel.find(filters)
      .populate('author', { email: 1, name: 1, _id: 0 })
      .sort({
        updated_at: -1,
      })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    res.status(statusCodes.success).json({
      totalBlogs,
      totalPages: Math.ceil(totalBlogs / +limit),
      currentPage: +page,
      blogs,
    });
  } catch (error) {
    logger.error(error);
    res.status(statusCodes.queryError).json({ error: 'Error fetching blogs' });
  }
};

export default {
  createBlog,
  editBlog,
  toggleBlogStatus,
  getBlogsForAdmin,
  getBlogs,
  getBlogById,
};
