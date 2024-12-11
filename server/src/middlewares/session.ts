import { Response, NextFunction } from 'express';
import statusCodes from '../constants/statusCodes';
import logger from './winston';
import { UserRequest } from '../types/customRequests.interface';

const verifySession = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.session?.user) {
    logger.error('No session user provided');
    res
      .status(statusCodes.unauthorized)
      .json({ error: 'Unauthorized', message: 'No session user provided' });
    return;
  }

  logger.info('SESSION USER: ', req.session.user);
  next();
};

export default verifySession;
