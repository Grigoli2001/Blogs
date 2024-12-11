import { Response } from 'express';
import BlogModel from '../../models/blog.model';
import blogController from '../../controllers/blog.controller';
import { BlogRequest } from '../../types/customRequests.interface';
import statusCodes from '../../constants/statusCodes';
import { Session, SessionData } from 'express-session';
import { firebaseUpload, validateFiles } from '../../utils/firebase.utils';

jest.mock('../../models/blog.model');
jest.mock('../../utils/firebase.utils');
jest.mock('../../middlewares/winston');

describe('Blog Controller', () => {
  let res: Partial<Response>;
  let req: Partial<BlogRequest>;

  beforeEach(() => {
    req = {
      body: {},
      files: undefined,
      session: {
        user: {
          _id: 'mockId',
        },
        cookie: {
          originalMaxAge: 1000,
          expires: new Date('2022-01-01'),
        },
      } as Session & SessionData,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('createBlog', () => {
    it('should return 400 if title or content is missing', async () => {
      await blogController.createBlog(req as BlogRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'title, category and content are required',
      });
    });
    it('should return 400 if title is less than 3 characters', async () => {
      req.body = { title: 'ab', content: 'mockContent', category: 'other' };
      await blogController.createBlog(req as BlogRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'title must be at least 3 characters',
      });
    });
    it('should return 400 if content is less than 3 characters', async () => {
      req.body = { title: 'mockTitle', content: 'ab', category: 'other' };
      await blogController.createBlog(req as BlogRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'content must be at least 3 characters',
      });
    });
    it('should return 400 if title is more than 120 characters', async () => {
      req.body = {
        title: 'a'.repeat(121),
        content: 'mockContent',
        category: 'other',
      };
      await blogController.createBlog(req as BlogRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'title must be at most 120 characters',
      });
    });
    it('should return 400 if content is more than 5000 characters', async () => {
      req.body = {
        title: 'mockTitle',
        content: 'a'.repeat(5001),
        category: 'other',
      };
      await blogController.createBlog(req as BlogRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'content must be at most 5000 characters',
      });
    });
    it('should return 500 if file is invalid', async () => {
      req.body = {
        title: 'mockTitle',
        content: 'mockContent',
        category: 'other',
      };
      req.files = [
        { originalname: 'mockFile', buffer: Buffer.from('mockContent') },
      ] as unknown as Express.Multer.File[];
      await blogController.createBlog(req as BlogRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error creating blog',
      });
    });
    it('should return 500 if failed to validate file', async () => {
      req.body = {
        title: 'mockTitle',
        content: 'mockContent',
        category: 'other',
      };
      req.files = [
        { originalname: 'mockFile', buffer: Buffer.from('mockContent') },
      ] as unknown as Express.Multer.File[];
      (validateFiles as jest.Mock).mockRejectedValue(
        new Error('Error creating blog'),
      );
      await blogController.createBlog(req as BlogRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error creating blog',
      });
    });
    it('should return 500 if failed to upload image', async () => {
      req.body = {
        title: 'mockTitle',
        content: 'mockContent',
        category: 'other',
      };
      req.files = [
        { originalname: 'mockFile', buffer: Buffer.from('mockContent') },
      ] as unknown as Express.Multer.File[];
      (validateFiles as jest.Mock).mockResolvedValue(req.files);
      (firebaseUpload as jest.Mock).mockRejectedValue(
        new Error('Error creating blog'),
      );
      await blogController.createBlog(req as BlogRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error creating blog',
      });
    });
    it('should return 500 if failed to save blog', async () => {
      req.body = {
        title: 'mockTitle',
        content: 'mockContent',
        category: 'other',
      };
      req.files = [
        { originalname: 'mockFile', buffer: Buffer.from('mockContent') },
      ] as unknown as Express.Multer.File[];
      (validateFiles as jest.Mock).mockResolvedValue(req.files);
      (firebaseUpload as jest.Mock).mockResolvedValue({
        media: 'mockURL',
        mimeType: 'mockType',
      });
      BlogModel.prototype.save = jest
        .fn()
        .mockRejectedValue(new Error('Error creating blog'));
      await blogController.createBlog(req as BlogRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error creating blog' });
    });
    // it('should return 200 if blog is created successfully', async () => {
    //   req.body = {
    //     title: 'mockTitle',
    //     content: 'mockContent',
    //     category: 'other',
    //   };
    //   req.files = [
    //     { originalname: 'mockFile', buffer: Buffer.from('mockContent') },
    //   ] as unknown as Express.Multer.File[];
    //   (validateFiles as jest.Mock).mockResolvedValue(req.files);
    //   (firebaseUpload as jest.Mock).mockResolvedValue({
    //     media: 'mockURL',
    //     mimeType: 'mockType',
    //   });
    //   BlogModel.prototype.save = jest.fn().mockResolvedValue({
    //     title: 'mockTitle',
    //     content: 'mockContent',
    //     image: 'mockURL',
    //     status: 'active',
    //     category: 'other',
    //   });
    //   await blogController.createBlog(req as BlogRequest, res as Response);
    //   expect(res.status).toHaveBeenCalledWith(statusCodes.success);
    //   expect(res.json).toHaveBeenCalledWith({
    //     title: 'mockTitle',
    //     content: 'mockContent',
    //     image: 'mockURL',
    //     status: 'active',
    //     category: 'other',
    //   });
    // });
  });
});
