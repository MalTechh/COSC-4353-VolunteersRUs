// routes/authRoutes.js

import express from 'express';
import { register, getUserById,login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.get('/user', getUserById);
router.post('/login', login);


export default router;