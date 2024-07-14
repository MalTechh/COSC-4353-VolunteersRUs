import React, { useState, useEffect } from 'react';
import NavBar from '../components/navbar'
import './Volunteer_Form.css';

const Volunteer_Form = () => {
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/volunteers', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          setVolunteers(data);
        } else {
          console.error('Failed to fetch volunteers');
        }
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    fetchVolunteers();
  }, []);

  const handleVolunteerChange = (e) => {
    const volunteerId = e.target.value;
    setSelectedVolunteerId(volunteerId);
    setSelectedEventId(''); // Reset selected event ID when volunteer changes
  };

  useEffect(() => {
    if (selectedVolunteerId) {
      const fetchMatchedEvents = async () => {
        try {
          const token = sessionStorage.getItem('authToken');
          const response = await fetch('http://localhost:3000/api/matching', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: selectedVolunteerId }),
          });

          if (response.ok) {
            const data = await response.json();
            setMatchedEvents(data.matchingEvents || []);
          } else {
            console.error('Failed to fetch matched events');
            setMatchedEvents([]);
          }
        } catch (error) {
          console.error('Error fetching matched events:', error);
          setMatchedEvents([]);
        }
      };
      fetchMatchedEvents();
    } else {
      setMatchedEvents([]);
    }
  }, [selectedVolunteerId]);

  const handleVolunteerMatch = async (e) => {
    e.preventDefault();

    // Validate form
    if (!selectedVolunteerId || !selectedEventId) {
      alert('Please select a volunteer and a matching event.');
      return;
    }

    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/submitmatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: selectedVolunteerId,
          eventId: selectedEventId
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Volunteer successfully matched to event!');
        console.log('Match result:', result);
        // Optionally, reset the form or do additional actions here
      } else {
        const error = await response.json();
        console.error('Error submitting volunteer match:', error);
        alert('Failed to match volunteer to event');
      }
    } catch (error) {
      console.error('Error submitting volunteer match:', error);
      alert('Failed to match volunteer to event');
    }
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
  };

  return (
    <>
      < NavBar/>
    <div className="auth-background">
      <div className="container">
        <div className="header">
          <div className="text">Volunteer Matching Form</div>
          <div className="underline"></div>
        </div>
        <form className="inputs" onSubmit={handleVolunteerMatch}>
          <div className="input">
            <label htmlFor="volunteerName">Volunteer Name</label>
            <select
              id="volunteerName"
              value={selectedVolunteerId}
              onChange={handleVolunteerChange}
            >
              <option value="">Select a Volunteer</option>
              {volunteers.map(volunteer => (
                <option key={volunteer.UserID} value={volunteer.UserID}>
                  {volunteer.FullName} - {volunteer.Preferences}
                </option>
              ))}
            </select>
          </div>
          <div className="input">
            <label htmlFor="matchedEvent">Matched Event</label>
            <select
              id="matchedEvent"
              value={selectedEventId}
              onChange={handleEventChange}
              disabled={!selectedVolunteerId}
            >
              <option value="">Select an Event</option>
              {matchedEvents.map(event => (
                <option key={event.EventID} value={event.EventID}>
                  {event.EventName} -- {formatDate(event.EventDate)}
                </option>
              ))}
            </select>
          </div>
          <div className="submit-container">
            <button className="submit" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default Volunteer_Form;