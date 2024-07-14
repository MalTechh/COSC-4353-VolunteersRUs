import React, { useState } from 'react';
import './Event_Form.css';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from 'date-fns';
import NavBar from '../components/navbar';
import MultiSelect from 'multiselect-react-dropdown';

const Event_Form = () => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [location, setLocation] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState('');
  const [eventDate, setEventDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!eventName.trim()) newErrors.eventName = 'Event name is required';
    if (eventName.length > 100) newErrors.eventName = 'Event name must be less than 100 characters';
    if (!eventDescription.trim()) newErrors.eventDescription = 'Event description is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (requiredSkills.length === 0) newErrors.requiredSkills = 'At least one skill is required';
    if (!urgency) newErrors.urgency = 'Urgency level is required';
    if (!eventDate) newErrors.eventDate = 'Event date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEvent = async () => {
    if (!validateForm()) {
      return;
    }

    const url = 'http://localhost:3000/api/events';
    const token = sessionStorage.getItem('authToken');
    const skillNames = requiredSkills.map(skill => skill.name);

    const eventData = {
      EventName: eventName,
      Description: eventDescription,
      Location: location,
      RequiredSkills: skillNames.join(','),
      Urgency: urgency,
      EventDate: eventDate.toISOString().split('T')[0],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Event created successfully:', result);
        setNotification('Event created successfully!');
        resetForm();
      } else {
        console.error('Error creating event:', response.statusText);
        setNotification('Error creating event: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error creating event:', error.message);
      setNotification('Error creating event: ' + error.message);
    }

    // Clear notification after a few seconds
    setTimeout(() => {
      setNotification('');
    }, 5000);
  };

  const resetForm = () => {
    setEventName('');
    setEventDescription('');
    setLocation('');
    setRequiredSkills([]);
    setUrgency('');
    setEventDate(null);
    setErrors({});
  };

  const skillsOptions = [
    { name: 'Event Planning', id: 1 },
    { name: 'Public Speaking', id: 2 },
    { name: 'Customer Service', id: 3 },
    { name: 'First Aid/CPR', id: 4 },
    { name: 'Logistics', id: 5 }
  ];

  const urgencyOptions = [
    'Low',
    'Medium',
    'High',
  ];

  return (
    <>
    <NavBar />
    <div className="auth-background">
      <div className="container">
        <div className="header">
          <div className="text">Create Event</div>
          <div className="signup-underline"></div>
        </div>
        <div className="inputs">
          <div className={`input ${errors.eventName ? 'error-state' : ''}`}>
            <label htmlFor="eventName">
              Event Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Event Name (Max 100 characters)"
              maxLength={100}
              required
              aria-required="true"
            />
            {errors.eventName && <div className="error">{errors.eventName}</div>}
          </div>

          <div className={`input ${errors.eventDescription ? 'error-state' : ''}`}>
            <label htmlFor="eventDescription">
              Event Description <span className="required">*</span>
            </label>
            <textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Event Description"
              required
              aria-required="true"
            />
            {errors.eventDescription && <div className="error">{errors.eventDescription}</div>}
          </div>

          <div className={`input ${errors.location ? 'error-state' : ''}`}>
            <label htmlFor="location">
              Location <span className="required">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              maxLength={100}
              required
              aria-required="true"
            />
            {errors.location && <div className="error">{errors.location}</div>}
          </div>

          <div className={`input ${errors.requiredSkills ? 'error-state' : ''}`}>
            <label htmlFor="requiredSkills">
              Required Skills <span className="required">*</span>
            </label>
            <MultiSelect
              options={skillsOptions}
              selectedValues={requiredSkills}
              onSelect={(selectedList) => setRequiredSkills(selectedList)}
              onRemove={(selectedList) => setRequiredSkills(selectedList)}
              displayValue="name"
              placeholder="Select Required Skills"
              className={`custom-multi-select ${errors.requiredSkills ? 'multi-select-error' : ''}`}
              required
              aria-required="true"
            />
            {errors.requiredSkills && <div className="error">{errors.requiredSkills}</div>}
          </div>

          <div className={`input ${errors.urgency ? 'error-state' : ''}`}>
            <label htmlFor="urgency">
              Urgency <span className="required">*</span>
            </label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              required
              aria-required="true"
            >
              <option value="">Select Urgency</option>
              {urgencyOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.urgency && <div className="error">{errors.urgency}</div>}
          </div>

          <div className={`input ${errors.eventDate ? 'error-state' : ''}`}>
            <label htmlFor="eventDate">
              Event Date <span className="required">*</span>
            </label>
            <DatePicker
              id="eventDate"
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              minDate={new Date()}
              placeholderText="Select Event Date"
              required
              aria-required="true"
              className="full-width-input"
            />
            {errors.eventDate && <div className="error">{errors.eventDate}</div>}
          </div>
        </div>
        <div className="submit-container">
          <button className="submit" onClick={handleEvent}>
            Create Event
          </button>
        </div>
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Event_Form;
