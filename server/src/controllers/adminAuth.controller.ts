import { Response } from 'express';
import AdminModel, { AdminDocument } from '../models/admin.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import statusCodes from '../constants/statusCodes';
import logger from '../middlewares/winston';
import { AuthRequest } from '../types/customRequests.interface';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const createFristAdmin = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // check if there is an admin
  const admin = await AdminModel.findOne({});
  if (admin) {
    res
      .status(statusCodes.unauthorized)
      .json({ error: 'Admin already exists' });
    return;
  }
  // create the first admin
  const { email, password, username, status = 'active' } = req.body;
  if (!email || !password) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'Email and password are required' });
    return;
  }
  if (!emailRegex.test(email)) {
    res.status(statusCodes.badRequest).json({ error: 'Invalid email' });
    return;
  }

  if (!passwordRegex.test(password)) {
    res.status(statusCodes.badRequest).json({
      error:
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character',
    });
    return;
  }

  if (username && username.length < 3) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'Username must be at least 3 characters' });
    return;
  }

  try {
    const finalUsername = username || email.split('@')[0];
    logger.info('Creating new admin');
    const hashedPassword = await bcrypt.hash(password, 10);
    logger.info('Password hashed successfully');
    const newAdmin = new AdminModel({
      email,
      password: hashedPassword,
      name: finalUsername,
      status,
      superAdmin: true,
    });
    logger.info('Admin created successfully');

    const savedAdmin = await newAdmin.save();
    logger.info('Admin saved successfully');
    res.status(statusCodes.success).json(savedAdmin);
  } catch (error) {
    logger.error(error);
    if (error.code === 11000) {
      res
        .status(statusCodes.userAlreadyExists)
        .json({ error: 'Email already exists' });
      return;
    }
    res.status(statusCodes.queryError).json({ error: 'Server error' });
  }
};

const adminSignUp = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password, username, status = 'active' } = req.body;

  if (!email || !password) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'Email and password are required' });
    return;
  }
  if (!emailRegex.test(email)) {
    res.status(statusCodes.badRequest).json({ error: 'Invalid email' });
    return;
  }
  if (!passwordRegex.test(password)) {
    res.status(statusCodes.badRequest).json({
      error:
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character',
    });
    return;
  }

  if (username && username.length < 3) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'Username must be at least 3 characters' });
    return;
  }

  try {
    const finalUsername = username || email.split('@')[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminModel({
      email,
      password: hashedPassword,
      name: finalUsername,
      status,
    });

    const savedAdmin = await newAdmin.save();
    res.status(statusCodes.success).json(savedAdmin);
  } catch (error) {
    logger.error(error);
    if (error.code === 11000) {
      res
        .status(statusCodes.userAlreadyExists)
        .json({ error: 'Email already exists' });
      return;
    }
    res.status(statusCodes.queryError).json({ error: 'Server error' });
  }
};

const adminLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'Email and password are required' });
    return;
  }

  try {
    const admin = (await AdminModel.findOne({ email })) as AdminDocument;
    if (!admin) {
      res
        .status(statusCodes.notFound)
        .json({ error: 'Email or password is incorrect' });
      return;
    }
    if (admin.status === 'inactive') {
      res.status(statusCodes.forbidden).json({ error: 'Account is inactive' });
      return;
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res
        .status(statusCodes.notFound)
        .json({ error: 'Email or password is incorrect' });
      return;
    }
    const accessToken = jwt.sign(
      { user: { _id: admin._id.toString(), email: admin.email } },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      },
    );
    const refreshToken = jwt.sign(
      { user: { _id: admin._id.toString(), email: admin.email } },
      process.env.REFRESH_SECRET,
      {
        expiresIn: '30d',
      },
    );

    req.session.user = {
      _id: admin._id.toString(),
    };
    res.cookie('refreshToken', refreshToken);
    res.status(statusCodes.success).json({ accessToken });
  } catch (err) {
    logger.error(err);
    res.status(statusCodes.queryError).json({ error: 'Server error', err });
  }
};

const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = await AdminModel.findById(req.session.user._id, {
      password: 0,
    });
    if (!admin) {
      res.status(statusCodes.notFound).json({ error: 'Admin not found' });
      return;
    }
    res.status(statusCodes.success).json(admin);
  } catch (error) {
    logger.error(error);
    res.status(statusCodes.queryError).json({ error: 'Server error' });
  }
};

const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res
      .status(statusCodes.badRequest)
      .json({ error: 'Refresh token is required' });
    return;
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET) as {
      user: { _id: string };
    };
    const admin = (await AdminModel.findById(
      decoded.user._id,
    )) as AdminDocument;
    if (!admin) {
      res.status(statusCodes.notFound).json({ error: 'Admin not found' });
      return;
    }
    const accessToken = jwt.sign(
      { user: { _id: admin._id.toString(), email: admin.email } },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
    res.status(statusCodes.success).json({ accessToken });
  } catch (error) {
    logger.error(error);
    res.status(statusCodes.queryError).json({ error: 'invalid token' });
  }
};

const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.session.user) {
    delete req.session.user;
  }
  res.clearCookie('refreshToken');
  res.status(statusCodes.success).json({ message: 'Disconnected' });
};

const getAdmins = async (req: AuthRequest, res: Response): Promise<void> => {
  // only superAdmin can get all admins
  const admin = (await AdminModel.findById(
    req.session.user._id,
  )) as AdminDocument;
  if (!admin.superAdmin) {
    res.status(statusCodes.unauthorized).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const admins = await AdminModel.find(
      { superAdmin: false },
      { password: 0 },
    );
    res.status(statusCodes.success).json(admins);
  } catch (error) {
    logger.error(error);
    res.status(statusCodes.queryError).json({ error: 'Server error' });
  }
};

// only superadmin can toggle admin status

const toggleAdminStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const admin = (await AdminModel.findById(
    req.session.user._id,
  )) as AdminDocument;
  if (!admin.superAdmin) {
    res.status(statusCodes.unauthorized).json({ error: 'Unauthorized' });
    return;
  }

  const { adminId } = req.params;
  const { status } = req.body;
  try {
    const admin = await AdminModel.findById(adminId);
    if (!admin) {
      res.status(statusCodes.notFound).json({ error: 'Admin not found' });
      return;
    }

    admin.status = status
      ? status
      : admin.status === 'active'
        ? 'inactive'
        : 'active';
    const savedAdmin: AdminDocument = await admin.save();
    res.status(statusCodes.success).json(savedAdmin);
  } catch (error) {
    logger.error(error);
    res
      .status(statusCodes.badRequest)
      .json({ error: 'Error toggling admin status' });
    return;
  }
};

// only superadmin can delete admin

export default {
  adminSignUp,
  adminLogin,
  createFristAdmin,
  getMe,
  refreshToken,
  logout,
  getAdmins,
  toggleAdminStatus,
};
