import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import eventRoutes from '../../server/routes/eventRoutes';
import * as eventController from '../../server/controllers/eventController';
import authMiddleware from '../../server/middlewares/authMiddleware';

jest.mock('../../server/controllers/eventController');
jest.mock('../../server/middlewares/authMiddleware');

const app = express();
app.use(bodyParser.json());
app.use('/', eventRoutes);

describe('Event Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an event', async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    eventController.createEvent.mockImplementation((req, res) => res.status(201).json({ message: 'Event created' }));

    const res = await request(app)
      .post('/events')
      .send({
        EventName: 'New Event',
        Description: 'Event Description',
        Location: 'Event Location',
        RequiredSkills: 'Skill1, Skill2',
        Urgency: 'High',
        EventDate: '2024-09-15'
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Event created');
  });

  it('should get all volunteers', async () => {
    const mockVolunteers = [
      { UserID: 1, FullName: 'John Doe', Preferences: 'Skill1, Skill2' },
      { UserID: 2, FullName: 'Jane Smith', Preferences: 'Skill3, Skill4' }
    ];
    eventController.getAllVolunteers.mockImplementation((req, res) => res.json(mockVolunteers));

    const res = await request(app).get('/volunteers');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockVolunteers);
  });

  it('should delete an event', async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    eventController.deleteEvent.mockImplementation((req, res) => res.status(204).send());

    const res = await request(app).delete('/events/1');

    expect(res.status).toBe(204);
  });

  it('should update an event', async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    eventController.updateEvent.mockImplementation((req, res) => res.status(200).json({ message: 'Event updated' }));

    const res = await request(app)
      .put('/events/1')
      .send({
        EventID: 1,
        EventName: 'Updated Event',
        Description: 'Updated Description',
        Location: 'Updated Location',
        RequiredSkills: 'Updated Skill1, Updated Skill2',
        Urgency: 'Medium',
        EventDate: '2024-10-20'
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Event updated');
  });

  it('should get a single event by ID', async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    const mockEvent = {
      EventID: 1,
      EventName: 'Sample Event',
      Description: 'Sample Description',
      Location: 'Sample Location',
      RequiredSkills: 'Sample Skill1, Sample Skill2',
      Urgency: 'High',
      EventDate: '2024-07-20'
    };
    eventController.getEventById.mockImplementation((req, res) => res.status(200).json(mockEvent));

    const res = await request(app).get('/events/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEvent);
  });

  it('should get all events', async () => {
    authMiddleware.mockImplementation((req, res, next) => next());
    const mockEvents = [
      {
        EventID: 1,
        EventName: 'Event1',
        Description: 'Description1',
        Location: 'Location1',
        RequiredSkills: 'Skill1, Skill2',
        Urgency: 'High',
        EventDate: '2024-07-20'
      },
      {
        EventID: 2,
        EventName: 'Event2',
        Description: 'Description2',
        Location: 'Location2',
        RequiredSkills: 'Skill3, Skill4',
        Urgency: 'Medium',
        EventDate: '2024-08-15'
      }
    ];
    eventController.getAllEvents.mockImplementation((req, res) => res.status(200).json(mockEvents));

    const res = await request(app).get('/events');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEvents);
  });
});
