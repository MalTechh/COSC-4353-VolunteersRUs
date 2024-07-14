import { Router } from 'express';
import {
  createEvent,
  getMatchedEvents,
  getAllVolunteers,
  matchVolunteerToEvent,
  getVolunteerHistory,
  updateEvent,
  getAllEvents,
  deleteEvent,
  getEventById, // New controller for getting a single event
} from '../controllers/eventController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/events', authMiddleware, createEvent);
router.post('/matching', getMatchedEvents);
router.get('/volunteers', getAllVolunteers);
router.post('/submitmatch', matchVolunteerToEvent);
router.post('/history', authMiddleware, getVolunteerHistory);
router.delete('/events/:eventId', authMiddleware, deleteEvent);
router.put('/events/:eventId', authMiddleware, updateEvent); // Include eventId in URL
router.get('/events/:eventId', authMiddleware, getEventById); // New route for fetching single event
router.get('/events', authMiddleware, getAllEvents);

export default router;
