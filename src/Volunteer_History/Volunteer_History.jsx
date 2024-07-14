import React, { useEffect, useState } from 'react';
import NavBar from '../components/navbar.jsx'
import './Volunteer_History.css';

const Volunteer_History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchVolunteerHistory();
  }, []);

  const fetchVolunteerHistory = async () => {
    const url = 'http://localhost:3000/api/history'; // Replace with your actual backend endpoint
    const token = sessionStorage.getItem('authToken');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    console.log(decodedToken);
    const { UserID } = decodedToken;
    console.log(UserID);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          UserID,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history); // Update state with fetched history data
        console.log('Volunteer history fetched successfully:', data);
      } else {
        console.error('Failed to fetch volunteer history:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching volunteer history:', error.message);
    }
  };
  
  return (
    <>
      < NavBar/>
    <div className="volunteer-history">
      <h2>Volunteer History</h2>
      <table className="volunteer-history-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Event Name</th>
            <th>Description</th>
            <th>Location</th>
            <th>Required Skills</th>
            <th>Urgency</th>
            <th>Event Date</th>
            <th>Participation Status</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((event, index) => (
              <tr key={index}>
                <td>{event.FullName}</td>
                <td>{event.EventName}</td>
                <td>{event.Description}</td>
                <td>{event.Location}</td>
                <td>{event.RequiredSkills}</td> 
                <td>{event.Urgency}</td>
                <td>{event.EventDate}</td>
                <td>{event.Status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No volunteer history available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Volunteer_History;