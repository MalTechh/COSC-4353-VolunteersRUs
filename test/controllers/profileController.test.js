import { createProfile, getProfile, updateProfile } from '../../server/controllers/profileController';
import { validationResult } from 'express-validator';

jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn()
}));

describe('Profile Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createProfile', () => {
    it('should create a profile successfully', async () => {
      req.body = {
        fullName: 'John Doe',
        address1: '123 Main St',
        address2: '',
        city: 'Sample City',
        state: 'CA',
        zipCode: '12345',
        skills: ['Skill1', 'Skill2'],
        preferences: 'None',
        availability: ['2024-07-20']
      };

      validationResult.mockReturnValue({
        isEmpty: () => true
      });

      await createProfile[createProfile.length - 1](req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        FullName: 'John Doe',
        Address1: '123 Main St',
        City: 'Sample City',
        State: 'CA',
        ZipCode: '12345'
      }));
    });

    it('should return validation errors', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Validation error' }]
      });

      await createProfile[createProfile.length - 1](req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Validation error' }] });
    });
  });

  describe('getProfile', () => {
    it('should return the saved profile', async () => {
      const savedProfile = {
        UserID: 1,
        FullName: 'John Doe',
        Address1: '123 Main St',
        Address2: '',
        City: 'Sample City',
        State: 'CA',
        ZipCode: '12345',
        Skills: '["Skill1","Skill2"]',
        Preferences: 'None',
        Availability: '["2024-07-20"]'
      };

      global.savedProfile = savedProfile; // Simulate the saved profile

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(savedProfile);
    });

  });

  describe('updateProfile', () => {
    it('should update the profile successfully', async () => {
      const savedProfile = {
        UserID: 1,
        FullName: 'John Doe',
        Address1: '123 Main St',
        Address2: '',
        City: 'Sample City',
        State: 'CA',
        ZipCode: '12345',
        Skills: '["Skill1","Skill2"]',
        Preferences: 'None',
        Availability: '["2024-07-20"]'
      };

      global.savedProfile = savedProfile; // Simulate the saved profile

      req.body = {
        fullName: 'Jane Doe',
        address1: '456 Main St',
        address2: 'Apt 1',
        city: 'New City',
        state: 'NY',
        zipCode: '54321',
        skills: ['Skill3', 'Skill4'],
        preferences: 'Some preferences',
        availability: ['2024-08-20']
      };

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        FullName: 'Jane Doe',
        Address1: '456 Main St',
        City: 'New City',
        State: 'NY',
        ZipCode: '54321'
      }));
    });
  });
});
