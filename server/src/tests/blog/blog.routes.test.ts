import request from 'supertest';
import { registerCoreMiddleWare } from '../../boot/setup';
import blogModel from '../../models/blog.model';
import statusCodes from '../../constants/statusCodes';
import { Application } from 'express';
import mongoose from 'mongoose';
import connectMongo from '../../boot/databases/mongo';
jest.mock('../../middlewares/winston');

describe('Blog Routes', () => {
  let app: Application;
  let testToken: string;
  let cookies: string | string[] | undefined;
  let cookiesCombined: string | string[] | undefined;

  const blogData = {
    title: 'Test Blog',
    content: 'This is a test blog',
    category: 'other',
  };
  const adminData = {
    email: 'test@gmail.com',
    password: 'Test1234!',
  };

  beforeAll(async () => {
    app = registerCoreMiddleWare();
    await connectMongo();
    await blogModel.deleteMany({});
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
    await blogModel.deleteMany({});
    mongoose.connection.close();
  });

  describe('POST /blog/create', () => {
    it('should return 400 if title or content are missing', async () => {
      const res = await request(app)
        .post('/api/blog/create')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Cookie', cookiesCombined.toString())
        .send({
          title: blogData.title,
        });
      expect(res.status).toBe(statusCodes.badRequest);
      expect(res.body.error).toBe('title, category and content are required');
    });
    it('should return 400 if title is less than 3 characters', async () => {
      const res = await request(app)
        .post('/api/blog/create')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Cookie', cookiesCombined.toString())
        .send({
          title: 'ab',
          content: 'Valid blog content',
          category: 'other',
        });
      expect(res.status).toBe(statusCodes.badRequest);
      expect(res.body.error).toBe('title must be at least 3 characters');
    });
    it('should return 400 if content is less than 3 characters', async () => {
      const res = await request(app)
        .post('/api/blog/create')
        .set('Authorization', `Bearer ${testToken}`)
        .set('Cookie', cookiesCombined.toString())
        .send({
          title: 'Valid title',
          content: 'ab',
          category: 'other',
        });
      expect(res.status).toBe(statusCodes.badRequest);
      expect(res.body.error).toBe('content must be at least 3 characters');
    });
  });
});
