// routes/authRoutes.js

import express from 'express';
import { register, getUserById } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.get('/user', getUserById);


export default router;