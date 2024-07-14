// controllers/eventController.js

// In-memory storage for events and volunteers
let events = [
  {
    EventID: 1,
    EventName: 'Community Cleanup',
    Description: 'Join us for a community cleanup event.',
    Location: 'Main Street Park',
    RequiredSkills: 'Event Planning, Public Speaking',
    Urgency: 'High',
    EventDate: '2024-07-20',
  },
  {
    EventID: 2,
    EventName: 'Food Drive',
    Description: 'Help organize and distribute food at the local food bank.',
    Location: 'Community Center',
    RequiredSkills: 'Organizing, Public Speaking',
    Urgency: 'Medium',
    EventDate: '2024-08-05',
  },
  {
    EventID: 3,
    EventName: 'Blood Donation Camp',
    Description: 'Assist in setting up and managing the blood donation camp.',
    Location: 'City Hospital',
    RequiredSkills: 'Event Planning, First Aid',
    Urgency: 'High',
    EventDate: '2024-07-30',
  },
  {
    EventID: 4,
    EventName: 'Tree Plantation',
    Description: 'Participate in planting trees in the community park.',
    Location: 'Green Valley Park',
    RequiredSkills: 'Gardening, Public Speaking',
    Urgency: 'Low',
    EventDate: '2024-09-15',
  },
  // Add more hardcoded events here if needed
];

let volunteers = [
  {
    UserID: 1,
    FullName: 'John Doe',
    Preferences: 'Event Planning, Public Speaking',
  },
  {
    UserID: 2,
    FullName: 'Jane Smith',
    Preferences: 'Organizing, First Aid',
  },
  {
    UserID: 3,
    FullName: 'Alice Johnson',
    Preferences: 'Gardening, Public Speaking',
  },
  {
    UserID: 4,
    FullName: 'Bob Brown',
    Preferences: 'Event Planning, First Aid',
  },
  // Add more hardcoded volunteers here if needed
];

let volunteerHistory = [
  {
    UserID: 1,
    EventID: 1,
    Status: 'Participated',
  },
  {
    UserID: 1,
    EventID: 2,
    Status: 'Participated',
  },
  {
    UserID: 2,
    EventID: 3,
    Status: 'Participated',
  },
  {
    UserID: 3,
    EventID: 4,
    Status: 'Participated',
  },
  {
    UserID: 4,
    EventID: 1,
    Status: 'Participated',
  },
  // Add more hardcoded volunteer history entries if needed
];

// Validation function
const validateEvent = (eventData) => {
  const { EventName, Description, Location, RequiredSkills, Urgency, EventDate } = eventData;

  if (!EventName || typeof EventName !== 'string' || EventName.length > 100) {
    return { valid: false, message: 'Event name is required and should be a string with a maximum length of 100 characters.' };
  }
  if (!Description || typeof Description !== 'string' || Description.length > 500) {
    return { valid: false, message: 'Description is required and should be a string with a maximum length of 500 characters.' };
  }
  if (!Location || typeof Location !== 'string' || Location.length > 100) {
    return { valid: false, message: 'Location is required and should be a string with a maximum length of 100 characters.' };
  }
  if (!RequiredSkills || typeof RequiredSkills !== 'string' || RequiredSkills.split(',').length === 0) {
    return { valid: false, message: 'At least one skill is required and should be a comma-separated string.' };
  }
  if (!Urgency || typeof Urgency !== 'string') {
    return { valid: false, message: 'Urgency level is required and should be a string.' };
  }
  if (!EventDate || isNaN(Date.parse(EventDate))) {
    return { valid: false, message: 'A valid event date is required.' };
  }

  return { valid: true };
};

export const createEvent = (req, res) => {
  const eventData = req.body;

  // Validate event data
  const validation = validateEvent(eventData);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  // Simulate saving the event
  const newEvent = {
    EventID: events.length + 1,
    ...eventData,
  };

  events.push(newEvent);

  // Send response
  res.status(201).json(newEvent);
};

export const getAllVolunteers = (req, res) => {
  res.json(volunteers);
};

// Example logic to find matched events based on volunteer preferences
const findMatchedEventsForVolunteer = (volunteerPreferences) => {
  return events.filter(event =>
    event.RequiredSkills.split(',').some(skill => volunteerPreferences.includes(skill.trim()))
  );
};

export const getMatchedEvents = (req, res) => {
  const { userId } = req.body;

  // Find the volunteer by ID
  const volunteer = volunteers.find(vol => vol.UserID === parseInt(userId, 10));

  if (!volunteer) {
    return res.status(404).json({ error: 'Volunteer not found' });
  }

  // Find matched events based on the volunteer's preferences
  const matchingEvents = findMatchedEventsForVolunteer(volunteer.Preferences);

  res.status(200).json({ matchingEvents });
};

export const matchVolunteerToEvent = (req, res) => {
  const { userId, eventId } = req.body;

  // Find the volunteer and event by IDs
  const volunteer = volunteers.find(vol => vol.UserID === parseInt(userId, 10));
  const event = events.find(evt => evt.EventID === parseInt(eventId, 10));

  if (!volunteer) {
    return res.status(404).json({ error: 'Volunteer not found' });
  }
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Simulate matching logic (e.g., updating a database)
  // For simplicity, we just log the match here
  console.log(`Matched volunteer ${volunteer.FullName} to event ${event.EventName}`);

  res.status(200).json({ message: 'Volunteer successfully matched to event' });
};

// Get volunteer history
export const getVolunteerHistory = (req, res) => {
  const { UserID } = req.body;

  console.log('Received UserID:', UserID);

  // Check if UserID is valid
  if (!UserID) {
    return res.status(400).json({ error: 'UserID is required.' });
  }

  // Filter volunteer history based on UserID
  const userHistory = volunteerHistory.filter((entry) => entry.UserID === UserID);

  // If no history found for the user
  if (!userHistory.length) {
    return res.status(404).json({ error: 'No volunteer history found.' });
  }

  // Format the history data with event and user details
  const formattedHistory = userHistory.map((entry) => {
    const event = events.find((evt) => evt.EventID === entry.EventID);
    const user = volunteers.find((usr) => usr.UserID === entry.UserID);
    return {
      FullName: user ? user.FullName : null,
      EventName: event ? event.EventName : null,
      Description: event ? event.Description : null,
      Location: event ? event.Location : null,
      RequiredSkills: event ? event.RequiredSkills : null,
      Urgency: event ? event.Urgency : null,
      EventDate: event ? event.EventDate : null,
      Status: entry.Status,
    };
  });

  console.log('Formatted Volunteer History:', formattedHistory);

  // Send the structured response
  res.status(200).json({ history: formattedHistory });
};


// controllers/eventController.js

export const updateEvent = (req, res) => {
  const { EventID, EventName, Description, Location, RequiredSkills, Urgency, EventDate } = req.body;

  // Find the event by ID
  const eventIndex = events.findIndex(event => event.EventID === EventID);
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Validate event data
  const validation = validateEvent(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  // Update the event
  events[eventIndex] = {
    EventID,
    EventName,
    Description,
    Location,
    RequiredSkills,
    Urgency,
    EventDate,
  };

  // Send response
  res.status(200).json(events[eventIndex]);
};

export const getAllEvents = (req, res) => {
  res.status(200).json(events);
};

// Delete an event by ID
export const deleteEvent = (req, res) => {
  const { eventId } = req.params;

  const eventIndex = events.findIndex(event => event.EventID === parseInt(eventId, 10));
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Remove the event from the array
  events.splice(eventIndex, 1);

  res.status(204).send(); // No content to send back
};

export const getEventById = (req, res) => {
  const { eventId } = req.params;
  const event = events.find(evt => evt.EventID === parseInt(eventId, 10));

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.status(200).json(event);
};
