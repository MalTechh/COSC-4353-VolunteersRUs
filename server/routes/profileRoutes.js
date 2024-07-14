// routes/profileRoutes.js

import { Router } from 'express';
import {  createProfile, getProfile, updateProfile } from '../controllers/profileController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();


router.get('/profile', authMiddleware, getProfile);
router.post('/profile', authMiddleware, createProfile);
router.put('/profile', authMiddleware, updateProfile);


export default router;