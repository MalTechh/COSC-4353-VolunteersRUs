import React, { useState, useEffect } from 'react';
import './Event_Form.css';
import './Edit_Event.css'
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NavBar from '../components/navbar';
import MultiSelect from 'multiselect-react-dropdown';

const EditEvent = () => {
  const { eventId } = useParams(); // Get the eventId from the URL
  const [event, setEvent] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState('');
  const [eventDate, setEventDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();


console.log(eventDate);
  useEffect(() => {
    fetchEvent();
  }, [eventId]); // Fetch the event whenever eventId changes

  const fetchEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch event');
  
      const data = await response.json();
      setEvent(data);
      setEventName(data.EventName);
      setEventDescription(data.Description);
      setEventLocation(data.Location);
      setRequiredSkills(data.RequiredSkills.split(',').map(skill => ({ name: skill.trim() })));
      setUrgency(data.Urgency);
      setEventDate(new Date(data.EventDate));
    } catch (error) {
      console.error('Error fetching event:', error);
      setNotification('Failed to load event data.');
    }
  };

  
  

  const validateForm = () => {
    const newErrors = {};
    if (!eventName.trim()) newErrors.eventName = 'Event name is required.';
    if (!eventDescription.trim()) newErrors.eventDescription = 'Description is required.';
    if (!eventLocation.trim()) newErrors.eventLocation = 'Location is required.';
    if (requiredSkills.length === 0) newErrors.requiredSkills = 'At least one skill is required.';
    if (!urgency) newErrors.urgency = 'Urgency is required.';
    if (!eventDate) newErrors.eventDate = 'Event date is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
   
    const updatedEvent = {
      EventName: eventName,
      Description: eventDescription,
      Location: eventLocation,
      RequiredSkills: requiredSkills.map(skill => skill.name).join(', '),
      Urgency: urgency,
      EventDate: eventDate.toISOString().split('T')[0],
    };
    console.log('Updated Event:', updatedEvent);


    try {
      const response = await fetch(`http://localhost:3000/api/events/${eventId}`, { // Use the eventId here
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`, // Include token if required
        },
        body: JSON.stringify(updatedEvent),
      });
  
      if (response.ok) {
        setNotification('Event updated successfully!');

      } else {
        setNotification('Failed to update event.');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setNotification('An error occurred while updating the event.');
    }
  };
  useEffect(() => {
    console.log('Updated Event:', { eventName, eventDescription, eventLocation, requiredSkills, urgency, eventDate });
}, [eventName, eventDescription, eventLocation, requiredSkills, urgency, eventDate]);

  

  return (
    <div className="edit-event-container">
      <NavBar />
      <h2>Edit Event</h2>
      {event ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Event Name</label>
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            {errors.eventName && <p className="error">{errors.eventName}</p>}
          </div>
          <div>
            <label>Description</label>
            <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            {errors.eventDescription && <p className="error">{errors.eventDescription}</p>}
          </div>
          <div>
            <label>Location</label>
            <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
            {errors.eventLocation && <p className="error">{errors.eventLocation}</p>}
          </div>
          <div>
            <label>Required Skills</label>
            <MultiSelect
              options={[{ name: 'Event Planning' }, { name: 'Public Speaking' }, { name: 'Organizing' }, { name: 'First Aid' }, { name: 'Gardening' }]}
              selectedValues={requiredSkills}
              onSelect={(selectedList) => setRequiredSkills(selectedList)}
              onRemove={(selectedList) => setRequiredSkills(selectedList)}
              displayValue="name"
            />
            {errors.requiredSkills && <p className="error">{errors.requiredSkills}</p>}
          </div>
          <div>
            <label>Urgency</label>
            <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
              <option value="">Select urgency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {errors.urgency && <p className="error">{errors.urgency}</p>}
          </div>
          <div>
            <label>Event Date</label>
            <DatePicker selected={eventDate} onChange={(date) => setEventDate(date)} />
            {errors.eventDate && <p className="error">{errors.eventDate}</p>}
          </div>
          <button type="submit">Update Event</button>
        </form>
      ) : (
        <p>Loading event...</p>
      )}
      {notification && <p className="notification">{notification}</p>}
    </div>
  );
};

export default EditEvent;
