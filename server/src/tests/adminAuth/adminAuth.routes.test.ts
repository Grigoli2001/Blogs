import request from 'supertest';
import { registerCoreMiddleWare } from '../../boot/setup';
import adminModel from '../../models/admin.model';
import statusCodes from '../../constants/statusCodes';
import { Application } from 'express';
import mongoose from 'mongoose';
import connectMongo from '../../boot/databases/mongo';

jest.mock('../../middlewares/winston');

describe('Admin Auth Routes', () => {
  let app: Application;
  let testToken: string;
  let cookies: string | string[] | undefined;
  let cookiesCombined: string | string[] | undefined;

  const adminData = {
    email: 'test@gmail.com',
    password: 'Test1234!',
  };

  beforeAll(async () => {
    app = registerCoreMiddleWare();
    await connectMongo();
    await adminModel.deleteMany({});
    await request(app).post('/api/admin/createfirstadmin').send(adminData);
    const loginRes = await request(app)
      .post('/api/admin/login')
      .send(adminData);
    const { accessToken } = loginRes.body;
    if (!accessToken) throw new Error('Token not found');
    testToken = loginRes.body.accessToken;
    cookies = loginRes.header['set-cookie'];
    cookiesCombined = `${cookies?.[0]}; ${cookies?.[1]}`;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await adminModel.deleteMany({});
    mongoose.connection.close();
  });

  describe('POST /admin/signup', () => {
    it('should return 400 if email or password are missing', async () => {
      const res = await request(app)
        .post('/api/admin/signup')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Cookie', cookiesCombined.toString())
        .send({
          email: adminData.email,
        });
      expect(res.status).toBe(statusCodes.badRequest);
      expect(res.body.error).toBe('Email and password are required');
    });

    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/admin/signup')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Cookie', cookiesCombined.toString())
        .send({
          email: 'test',
          password: adminData.password,
        });
      expect(res.status).toBe(statusCodes.badRequest);
      expect(res.body.error).toBe('Invalid email');
    });
    it('should return 400 if password is invalid', async () => {
      const res = await request(app)
        .post('/api/admin/signup')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Cookie', cookiesCombined.toString())
        .send({
          email: adminData.email,
          password: 'test',
        });
      expect(res.status).toBe(statusCodes.badRequest);
      expect(res.body.error).toBe(
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character',
      );
    });

    it('should return 400 if username is less than 3 characters', async () => {
      const res = await request(app)
        .post('/api/admin/signup')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Cookie', cookiesCombined.toString())
        .send({
          email: adminData.email,
          password: adminData.password,
          username: 'te',
        });
      expect(res.status).toBe(statusCodes.badRequest);
      expect(res.body.error).toBe('Username must be at least 3 characters');
    });

    it('should return 200 if admin is created successfully', async () => {
      const newAdminData = {
        email: 'newadmin@gmail.com',
        password: adminData.password,
      };
      const res = await request(app)
        .post('/api/admin/signup')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Cookie', cookiesCombined.toString())
        .send(newAdminData);
      expect(res.status).toBe(statusCodes.success);
      expect(res.body.email).toBe(newAdminData.email);
    });
  });
  describe('POST /admin/login', () => {
    it('should return 400 if email or password are missing', async () => {
      const res = await request(app).post('/api/admin/login').send({
        email: adminData.email,
      });
      expect(res.status).toBe(statusCodes.badRequest);
      expect(res.body.error).toBe('Email and password are required');
    });
    it('should return 400 if email is invalid', async () => {
      const res = await request(app).post('/api/admin/login').send({
        email: 'test',
        password: adminData.password,
      });
      expect(res.status).toBe(statusCodes.notFound);
      expect(res.body.error).toBe('Email or password is incorrect');
    });

    it('should return 400 if password is invalid', async () => {
      const res = await request(app).post('/api/admin/login').send({
        email: adminData.email,
        password: 'test',
      });
      expect(res.status).toBe(statusCodes.notFound);
      expect(res.body.error).toBe('Email or password is incorrect');
    });
    it('should return 200 and tokens if admin is logged in successfully', async () => {
      await request(app).post('/api/admin/signup').send(adminData);
      const res = await request(app).post('/api/admin/login').send(adminData);
      expect(res.status).toBe(statusCodes.success);
      expect(res.body).toHaveProperty('accessToken');
    });
  });
  describe('GET /admin/me', () => {
    it('should return 401 if token is missing', async () => {
      const res = await request(app).get('/api/admin/me');
      expect(res.status).toBe(statusCodes.unauthorized);
      expect(res.body.error).toBe('Unauthorized');
    });

    it('should return 401 if token is invalid', async () => {
      const res = await request(app)
        .get('/api/admin/me')
        .set('Authorization', 'Bearer invalidtoken')
        .set('Cookie', cookiesCombined.toString());
      expect(res.status).toBe(statusCodes.unauthorized);
      expect(res.body.error?.message).toBe('jwt malformed');
    });

    it('should return 200 if token is valid', async () => {
      const res = await request(app)
        .get('/api/admin/me')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Cookie', cookiesCombined.toString());
      expect(res.status).toBe(statusCodes.success);
      expect(res.body.email).toBe(adminData.email);
    });
  });
  describe('POST /admin/refresh', () => {
    it('should return 200 if refresh token is valid', async () => {
      const res = await request(app)
        .get('/api/admin/refresh')
        .set('Cookie', cookiesCombined.toString());
      expect(res.status).toBe(statusCodes.success);
      expect(res.body).toHaveProperty('accessToken');
    });
  });
  describe('GET /admin/logout', () => {
    it('should return 200 if user is logged out', async () => {
      const res = await request(app)
        .get('/api/admin/logout')
        .set('Cookie', cookiesCombined.toString());
      expect(res.status).toBe(statusCodes.success);
      expect(res.body.message).toBe('Disconnected');
    });
  });
});
