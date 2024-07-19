// authController.test.js

import { register, getUserById } from '../../server/controllers/authController';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

let users = [];

// Helper function to create mock request and response objects
const mockRequestResponse = (body = {}, headers = {}) => {
  const req = {
    body,
    headers,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return { req, res };
};

describe('Auth Controller', () => {
  beforeEach(() => {
    // Clear the in-memory users array before each test
    users = [];
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const { req, res } = mockRequestResponse({
        email: 'test@example.com',
        passwordhash: 'password123',
        username: 'testuser',
        admin: 1,
      });

      bcrypt.hash.mockResolvedValue('hashedPassword');
      jwt.sign.mockReturnValue('token');

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: 'token' });
    });

    it('should return 400 if email, password or username is missing', async () => {
      const { req, res } = mockRequestResponse({
        email: '',
        passwordhash: '',
        username: '',
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email, password, and username are required.' });
    });

    it('should return 400 if email format is invalid', async () => {
      const { req, res } = mockRequestResponse({
        email: 'invalid-email',
        passwordhash: 'password123',
        username: 'testuser',
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format.' });
    });

    it('should return 400 if password is less than 6 characters', async () => {
      const { req, res } = mockRequestResponse({
        email: 'test@example.com',
        passwordhash: '123',
        username: 'testuser',
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Password must be at least 6 characters long.' });
    });

    it('should return 400 if username is less than 3 characters', async () => {
      const { req, res } = mockRequestResponse({
        email: 'test@example.com',
        passwordhash: 'password123',
        username: 'te',
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username must be at least 3 characters long.' });
    });
  });

  describe('getUserById', () => {
    it('should return user data for a valid token', async () => {
      users.push({
        UserID: 1,
        email: 'test@example.com',
        passwordhash: 'hashedPassword',
        username: 'testuser',
        UserType: 'Admin',
      });

      const token = jwt.sign({ UserID: 1, UserType: 'Admin' }, 'your_jwt_secret');
      const { req, res } = mockRequestResponse({}, { authorization: `Bearer ${token}` });

      jwt.verify.mockReturnValue({ UserID: 1 });

      await getUserById(req, res);

      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        UserID: 1,
        username: 'testuser',
        email: 'test@example.com',
        UserType: 'Admin',
      });
    });

    it('should return 401 if no token is provided', async () => {
      const { req, res } = mockRequestResponse();

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'No token provided.' });
    });

    it('should return 404 if user is not found', async () => {
      const token = jwt.sign({ UserID: 999, UserType: 'Admin' }, 'your_jwt_secret');
      const { req, res } = mockRequestResponse({}, { authorization: `Bearer ${token}` });

      jwt.verify.mockReturnValue({ UserID: 999 });

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });

    it('should return 500 if token is invalid', async () => {
      const { req, res } = mockRequestResponse({}, { authorization: 'Bearer invalidtoken' });

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
  });
});
