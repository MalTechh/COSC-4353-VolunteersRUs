
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { register, getUserById } from './authController';

const app = express();
app.use(bodyParser.json());

app.post('/register', register);
app.get('/user', getUserById);

describe('Auth Controller', () => {
  beforeEach(() => {
    users = [];
  });

  describe('POST /register', () => {
    it('should register a user successfully', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          passwordhash: 'password123',
          username: 'testuser',
          admin: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
    });

    it('should return 400 if email, password or username is missing', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: '',
          passwordhash: '',
          username: '',
          admin: 0,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email, password, and username are required.');
    });

    it('should return 400 if email format is invalid', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'invalid-email',
          passwordhash: 'password123',
          username: 'testuser',
          admin: 0,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid email format.');
    });

    it('should return 400 if password is less than 6 characters', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          passwordhash: '123',
          username: 'testuser',
          admin: 0,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Password must be at least 6 characters long.');
    });

    it('should return 400 if username is less than 3 characters', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          passwordhash: 'password123',
          username: 'te',
          admin: 0,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Username must be at least 3 characters long.');
    });
  });

  describe('GET /user', () => {
    it('should return user data for a valid token', async () => {
      // Register a user to get a token
      const registerRes = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          passwordhash: 'password123',
          username: 'testuser',
          admin: 1,
        });

      const token = registerRes.body.token;

      const res = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('testuser');
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.UserType).toBe('Admin');
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/user');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('No token provided.');
    });

    it('should return 404 if user is not found', async () => {
      const fakeToken = jwt.sign({ UserID: 999, UserType: 'Admin' }, 'your_jwt_secret');

      const res = await request(app)
        .get('/user')
        .set('Authorization', `Bearer ${fakeToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found.');
    });

    it('should return 500 if token is invalid', async () => {
      const res = await request(app)
        .get('/user')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Internal Server Error.');
    });
  });
});
