import { Router, Request, Response } from 'express';
import statusCodes from '../constants/statusCodes';

const router = Router();

export const healthCheck = (_req: Request, res: Response): void => {
  res.status(statusCodes.success).json({
    message: 'All up and running !!',
  });
};

export const healthCheckAsync = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const healthStatus = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
      };
      res.status(200).json(healthStatus);
      resolve();
    }, 2000);
  });
};
router.get('/api/health', healthCheck);
router.get('/api/health/async', healthCheckAsync);

export default router;
