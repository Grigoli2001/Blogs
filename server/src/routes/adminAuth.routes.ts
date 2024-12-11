import express from 'express';
import adminAuthRoutes from '../controllers/adminAuth.controller';
import verifyToken from '../middlewares/authentication';
import verifySession from '../middlewares/session';
const router = express.Router();

router.post('/admin/createfirstadmin', adminAuthRoutes.createFristAdmin);
router.post(
  '/admin/signup',
  verifyToken,
  verifySession,
  adminAuthRoutes.adminSignUp,
);
router.post('/admin/login', adminAuthRoutes.adminLogin);
router.get('/admin/me', verifyToken, verifySession, adminAuthRoutes.getMe);
router.get('/admin/refresh', verifySession, adminAuthRoutes.refreshToken);
router.get('/admin/logout', adminAuthRoutes.logout);
router.get(
  '/admin/admins',
  verifyToken,
  verifySession,
  adminAuthRoutes.getAdmins,
);
router.put(
  '/admin/toggle/:adminId',
  verifyToken,
  verifySession,
  adminAuthRoutes.toggleAdminStatus,
);

export default router;
