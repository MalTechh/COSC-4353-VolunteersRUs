// controllers/profileController.js
import { check, validationResult } from 'express-validator';

// Server-side storage for the profile
let savedProfile = null;

// Create Profile with Validation Middleware
export const createProfile = [
  // Validation rules
  check('fullName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Full name is required and cannot exceed 50 characters.')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Full name should only contain letters and spaces.'),
  check('address1')
    .isLength({ min: 1, max: 100 })
    .withMessage('Address 1 is required and cannot exceed 100 characters.'),
  check('city')
    .isLength({ min: 1, max: 100 })
    .withMessage('City is required and cannot exceed 100 characters.')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('City should only contain letters and spaces.'),
  check('state').notEmpty().withMessage('State is required.'),
  check('zipCode')
    .isLength({ min: 5, max: 9 })
    .withMessage('Zip code must be between 5 to 9 digits.')
    .isNumeric()
    .withMessage('Zip code must be numeric.'),
  check('skills').isArray({ min: 1 }).withMessage('At least one skill is required.'),
  check('availability').isArray({ min: 1 }).withMessage('At least one date is required for availability.'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      fullName,
      address1,
      address2,
      city,
      state,
      zipCode,
      skills,
      preferences,
      availability,
    } = req.body;

    try {
      // Hardcoded profile data for testing
      const profile = {
        UserID: 1,
        FullName: fullName,
        Address1: address1,
        Address2: address2,
        City: city,
        State: state,
        ZipCode: zipCode,
        Skills: JSON.stringify(skills),
        Preferences: preferences || 'None',
        Availability: JSON.stringify(availability),
      };

      // Save profile to server-side storage
      savedProfile = profile;
      // Return the created profile
      res.status(201).json(profile);
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(400).json({ error: 'Error creating profile.' });
    }
  }
];


export const getProfile = async (req, res) => {
  if (savedProfile) {
    res.status(200).json(savedProfile);
  } else {
    res.status(404).json({ error: 'Profile not found' });
  }
};

// Update Profile with Validation Middleware
export const updateProfile =  async (req, res) => {


    console.log("hello from updateProifle")
    const {
      fullName,
      address1,
      address2,
      city,
      state,
      zipCode,
      skills,
      preferences,
      availability,
    } = req.body;

    try {
      // Update the saved profile with the new data
      if (savedProfile) {
        savedProfile.FullName = fullName;
        savedProfile.Address1 = address1;
        savedProfile.Address2 = address2;
        savedProfile.City = city;
        savedProfile.State = state;
        savedProfile.ZipCode = zipCode;
        savedProfile.Skills = JSON.stringify(skills);
        savedProfile.Preferences = preferences || 'None';
        savedProfile.Availability = JSON.stringify(availability);
      } else {
        return res.status(404).json({ error: 'Profile not found' });
      }

      console.log('Updated Profile:', savedProfile);
      // Return the updated profile
      res.status(200).json(savedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(400).json({ error: 'Error updating profile.' });
    }
  }


