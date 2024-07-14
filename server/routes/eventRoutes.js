// routes/eventRoutes.js

import { Router } from 'express';
import { createEvent, getMatchedEvents, getAllVolunteers, matchVolunteerToEvent, getVolunteerHistory  } from '../controllers/eventController.js'
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/events', authMiddleware, createEvent);
router.post('/matching', getMatchedEvents);
router.get('/volunteers', getAllVolunteers);
router.post('/submitmatch', matchVolunteerToEvent);
router.post('/history', authMiddleware, getVolunteerHistory);

export default router;









