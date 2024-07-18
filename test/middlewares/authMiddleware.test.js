import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import authMiddleware from '../../server/middlewares/authMiddleware';

jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

// Add a protected route to test the middleware
app.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/protected');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized access.');
  });

  it('should return 401 if token is invalid', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid token.');
  });

  it('should call next and set req.user if token is valid', async () => {
    const mockUser = { UserID: 1, UserType: 'Admin' };
    jwt.verify.mockImplementation(() => mockUser);

    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer validtoken');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Access granted');
    expect(res.body.user).toEqual({ id: mockUser.UserID, type: mockUser.UserType });
  });
});
