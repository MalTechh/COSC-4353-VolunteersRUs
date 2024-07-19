import {
    createEvent,
    getAllVolunteers,
    getMatchedEvents,
    matchVolunteerToEvent,
    getVolunteerHistory,
    updateEvent,
    getAllEvents,
    deleteEvent,
    getEventById
  } from '../../server/controllers/eventVolunteerController';
  
  describe('Event Controller', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        body: {},
        params: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };
    });
  
    describe('createEvent', () => {
      it('should create an event', () => {
        req.body = {
          EventName: 'New Event',
          Description: 'Event Description',
          Location: 'Event Location',
          RequiredSkills: 'Skill1, Skill2',
          Urgency: 'High',
          EventDate: '2024-09-15'
        };
  
        createEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body));
      });
  
      it('should return validation error for invalid event data', () => {
        req.body = { EventName: '' };
  
        createEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
      });
    });
  
    describe('getAllVolunteers', () => {
      it('should return all volunteers', () => {
        getAllVolunteers(req, res);
  
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
          expect.objectContaining({ UserID: expect.any(Number) }),
        ]));
      });
    });
  
    describe('getMatchedEvents', () => {
      it('should return matched events for a volunteer', () => {
        req.body = { userId: 1 };
  
        getMatchedEvents(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ matchingEvents: expect.any(Array) }));
      });
  
      it('should return 404 if volunteer not found', () => {
        req.body = { userId: 999 };
  
        getMatchedEvents(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Volunteer not found' });
      });
    });
  
    describe('matchVolunteerToEvent', () => {
      it('should match a volunteer to an event', () => {
        req.body = { userId: 1, eventId: 1 };
  
        matchVolunteerToEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Volunteer successfully matched to event' });
      });
  
      it('should return 404 if volunteer or event not found', () => {
        req.body = { userId: 999, eventId: 1 };
  
        matchVolunteerToEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
      });
    });
  
    describe('getVolunteerHistory', () => {
      it('should return volunteer history for a valid user ID', () => {
        req.body = { UserID: 1 };
  
        getVolunteerHistory(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ history: expect.any(Array) }));
      });
  
      it('should return 400 if user ID is not provided', () => {
        getVolunteerHistory(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'UserID is required.' });
      });
  
      it('should return 404 if no history is found', () => {
        req.body = { UserID: 999 };
  
        getVolunteerHistory(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No volunteer history found.' });
      });
    });
  
    describe('updateEvent', () => {
      it('should update an event', () => {
        req.body = {
          EventID: 1,
          EventName: 'Updated Event',
          Description: 'Updated Description',
          Location: 'Updated Location',
          RequiredSkills: 'Updated Skill1, Updated Skill2',
          Urgency: 'Medium',
          EventDate: '2024-10-20'
        };
  
        updateEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body));
      });
  
      it('should return 404 if event not found', () => {
        req.body = {
          EventID: 999,
          EventName: 'Updated Event',
          Description: 'Updated Description',
          Location: 'Updated Location',
          RequiredSkills: 'Updated Skill1, Updated Skill2',
          Urgency: 'Medium',
          EventDate: '2024-10-20'
        };
  
        updateEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Event not found' });
      });
    });
  
    describe('getAllEvents', () => {
      it('should return all events', () => {
        getAllEvents(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
          expect.objectContaining({ EventID: expect.any(Number) }),
        ]));
      });
    });
  
    describe('deleteEvent', () => {
      it('should delete an event', () => {
        req.params = { eventId: 1 };
  
        deleteEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(204);
      });
  
      it('should return 404 if event not found', () => {
        req.params = { eventId: 999 };
  
        deleteEvent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Event not found' });
      });
    });
  
    describe('getEventById', () => {
        it('should return an event by ID', () => {
          req.params.eventId = 1;
    
          getEventById(req, res);
    
          expect(res.status).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledTimes(1);
        });
    
        it('should return 404 if event not found', () => {
          req.params.eventId = 999;
    
          getEventById(req, res);
    
          expect(res.status).toHaveBeenCalledTimes(1);
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledWith({ error: 'Event not found' });
        });
      });
    });  