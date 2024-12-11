import { Response } from 'express';
import adminModel, { Admin } from '../../models/admin.model';
import bcrypt from 'bcryptjs';
import authController from '../../controllers/adminAuth.controller';
import { AuthRequest } from '../../types/customRequests.interface';
import statusCodes from '../../constants/statusCodes';
import Jwt from 'jsonwebtoken';
import { Session, SessionData } from 'express-session';

jest.mock('../../models/admin.model');
jest.mock('../../middlewares/winston');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  const authBody: Admin = {
    email: 'testuser@gmail.com',
    password: 'Test1234!',
    status: 'active',
  };
  const mockUser = {
    _id: 'mockId',
    email: 'testuser@gmail.com',
    username: 'testuser',
    password: 'hTest1234!',
  };

  beforeEach(() => {
    req = {
      body: {},
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
      clearCookie: jest.fn(),
      cookie: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('/signup', () => {
    it('should return 400 if email or password are missing', async () => {
      req.body = {
        email: authBody.email,
      };

      await authController.adminSignUp(req as AuthRequest, res as Response);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(adminModel.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email and password are required',
      });
    });
    it('should return 400 if email is invalid', async () => {
      req.body = {
        email: 'testuser',
        password: authBody.password,
      };

      await authController.adminSignUp(req as AuthRequest, res as Response);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(adminModel.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email' });
    });

    it('should return 400 if password is invalid', async () => {
      req.body = {
        email: authBody.email,
        password: 'test',
      };

      await authController.adminSignUp(req as AuthRequest, res as Response);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(adminModel.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error:
          'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character',
      });
    });

    it('should return 400 if username is invalid', async () => {
      req.body = {
        email: authBody.email,
        password: authBody.password,
        username: 'te',
      };

      await authController.adminSignUp(req as AuthRequest, res as Response);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(adminModel.prototype.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Username must be at least 3 characters',
      });
    });

    it('should return 409 if email already exists', async () => {
      req.body = authBody;
      adminModel.prototype.save = jest.fn().mockRejectedValue({ code: 11000 });

      await authController.adminSignUp(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.userAlreadyExists);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });

    it('should return 500 if there is a server error', async () => {
      req.body = authBody;
      adminModel.prototype.save = jest.fn().mockRejectedValue(new Error());

      await authController.adminSignUp(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });

    it('should create a new admin', async () => {
      req.body = authBody;
      adminModel.prototype.save = jest.fn().mockResolvedValue(authBody);

      await authController.adminSignUp(req as AuthRequest, res as Response);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(adminModel.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(res.json).toHaveBeenCalledWith(authBody);
    });
  });

  describe('/login', () => {
    it('should return 400 if email or password are missing', async () => {
      req.body = {
        email: authBody.email,
      };

      await authController.adminLogin(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email and password are required',
      });
    });
    it('should return 404 if email is incorrect', async () => {
      req.body = authBody;
      adminModel.findOne = jest.fn().mockResolvedValue(null);

      await authController.adminLogin(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.notFound);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email or password is incorrect',
      });
    });
    it('should return 404 if password is incorrect', async () => {
      req.body = authBody;
      adminModel.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await authController.adminLogin(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.notFound);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email or password is incorrect',
      });
    });
    it('should return 200 if login is successful and return accesstoken and refreshtoken', async () => {
      req.body = authBody;
      adminModel.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      Jwt.sign = jest.fn().mockReturnValue('mockToken');

      await authController.adminLogin(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(res.json).toHaveBeenCalledWith({
        accessToken: 'mockToken',
      });
    });
  });

  describe('/getMe', () => {
    it('should return 404 if admin is not found', async () => {
      adminModel.findById = jest.fn().mockResolvedValue(null);

      await authController.getMe(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.notFound);
      expect(res.json).toHaveBeenCalledWith({ error: 'Admin not found' });
    });

    it('should return 200 and the admin', async () => {
      adminModel.findById = jest.fn().mockResolvedValue(mockUser);

      await authController.getMe(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
    it('should return 500 if there is a server error', async () => {
      adminModel.findById = jest.fn().mockRejectedValue(new Error());

      await authController.getMe(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('/refreshToken', () => {
    it('should return 400 if there is no refresh token', async () => {
      await authController.refreshToken(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.badRequest);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Refresh token is required',
      });
    });
    it('should return 401 if the refresh token is invalid', async () => {
      req.cookies = { refreshToken: 'mockToken' };
      Jwt.verify = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      await authController.refreshToken(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.queryError);
      expect(res.json).toHaveBeenCalledWith({ error: 'invalid token' });
    });
    it('should return 404 if admin is not found', async () => {
      req.cookies = { refreshToken: 'mockToken' };
      Jwt.verify = jest.fn().mockReturnValue({ user: { _id: 'mockId' } });
      adminModel.findById = jest.fn().mockResolvedValue(null);

      await authController.refreshToken(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.notFound);
      expect(res.json).toHaveBeenCalledWith({ error: 'Admin not found' });
    });

    it('should return 200 and a new access token', async () => {
      req.cookies = { refreshToken: 'mockToken' };
      Jwt.verify = jest.fn().mockReturnValue({ user: { _id: 'mockId' } });
      adminModel.findById = jest.fn().mockResolvedValue(mockUser);
      Jwt.sign = jest.fn().mockReturnValue('mockToken');

      await authController.refreshToken(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(res.json).toHaveBeenCalledWith({ accessToken: 'mockToken' });
    });
  });
  describe('/logout', () => {
    it('should return 200', async () => {
      await authController.logout(req as AuthRequest, res as Response);
      expect(res.status).toHaveBeenCalledWith(statusCodes.success);
      expect(res.json).toHaveBeenCalledWith({ message: 'Disconnected' });
    });
  });
});
