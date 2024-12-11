import express from 'express';
import blogRoutes from '../controllers/blog.controller';
import multer from 'multer';
import verifySession from '../middlewares/session';
import verifyToken from '../middlewares/authentication';

const storage = multer.diskStorage({});
const router = express.Router();
const upload = multer({ storage });

router.post(
  '/blog/create',
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),

  verifySession,
  verifyToken,
  blogRoutes.createBlog,
);

router.put(
  '/blog/:id',
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),
  verifySession,
  verifyToken,
  blogRoutes.editBlog,
);

router.put(
  '/blog/toggle/:id',
  verifySession,
  verifyToken,
  blogRoutes.toggleBlogStatus,
);

// getBlogs for admin with query params
router.get(
  '/admin/blogs',
  verifySession,
  verifyToken,
  blogRoutes.getBlogsForAdmin as unknown as express.RequestHandler,
);

router.get(
  '/blog/:id',
  blogRoutes.getBlogById as unknown as express.RequestHandler,
);

// get all blogs for the frontend with infinite scroll
router.get('/blogs', blogRoutes.getBlogs as unknown as express.RequestHandler);

export default router;
