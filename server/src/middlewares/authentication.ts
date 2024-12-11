import { Response, NextFunction } from 'express';
import jwt, { UserJwtPayload } from 'jsonwebtoken';
import statusCodes from '../constants/statusCodes';
import logger from './winston';
import { UserRequest } from '../types/customRequests.interface';

const verifyToken = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.header('Authorization');

  if (!token) {
    logger.error('No token provided');
    res
      .status(statusCodes.unauthorized)
      .json({ error: 'Unauthorized', message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token.split(' ')[1],
      process.env.JWT_SECRET as string,
    ) as UserJwtPayload;
    req.user = decoded.user;
    logger.info('TOKEN: ', token);
    logger.info('TOKEN USER: ', req.user);
    next();
  } catch (error) {
    logger.error(error);
    res
      .status(statusCodes.unauthorized)
      .json({ error, message: 'Invalid token' });
  }
};

export default verifyToken;
