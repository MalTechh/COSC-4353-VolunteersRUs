import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import profileRoutes from '../../server/routes/profileRoutes';
import * as profileController from '../../server/controllers/profileController';
import authMiddleware from '../../server/middlewares/authMiddleware';

// Mock the controllers and middleware
jest.mock('../../server/controllers/profileController');
jest.mock('../../server/middlewares/authMiddleware');

// Create an Express app with the routes
const app = express();
app.use(bodyParser.json());
app.use('/', profileRoutes);

describe('Profile Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get the profile', async () => {
    // Mock the auth middleware to call the next middleware
    authMiddleware.mockImplementation((req, res, next) => next());

    // Mock the getProfile handler function
    profileController.getProfile.mockImplementation((req, res) => {
      res.status(200).json({ FullName: 'John Doe' });
    });

    const res = await request(app).get('/profile');

    expect(res.status).toBe(200);
    expect(res.body.FullName).toBe('John Doe');
  });

  it('should update the profile', async () => {
    // Mock the auth middleware to call the next middleware
    authMiddleware.mockImplementation((req, res, next) => next());

    // Mock the updateProfile handler function
    profileController.updateProfile.mockImplementation((req, res) => {
      res.status(200).json({ message: 'Profile updated' });
    });

    const res = await request(app)
      .put('/profile')
      .send({
        fullName: 'Jane Doe',
        address1: '456 Main St',
        address2: 'Apt 1',
        city: 'New City',
        state: 'NY',
        zipCode: '54321',
        skills: ['Skill3', 'Skill4'],
        preferences: 'Some preferences',
        availability: ['2024-08-20']
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Profile updated');
  });
});
