import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { notify } from '../Notification.jsx';

const AnyComponent = () => {
  const handleClick = () => {
    notify('This is a notification message!');
  };

  return (
    <div>
      <button onClick={handleClick}>Show Notification</button>
    </div>
  );
};

const Home = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const token = sessionStorage.getItem('authToken');

      if (token) {
        try {
          // Decode the JWT token
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          console.log('Decoded Token:', decodedToken);

          // Correctly access UserID
          const { UserID, UserType } = decodedToken; // Ensure this matches the token structure
          
          console.log('UserType:', UserType);

          // Fetch username based on UserID
          if (UserID) {
            const response = await axios.get(`http://localhost:3000/api/user/${UserID}`);
            setUsername(response.data.username);
          } else {
            console.error('UserID not found in the token.');
          }
        } catch (error) {
          console.error('Error decoding token or fetching username:', error);
        }
      } else {
        console.warn('No auth token found in sessionStorage.');
      }
    };

    fetchUsername();
  }, []);

        

  return (
    <>
      <div>
        <h1>Welcome to the Homepage</h1>
        {username && <p>Welcome back, {username}!</p>}
      </div>

      <div className="home-cards">
        <Link to="/eventform" className="home-card">
          <h3>Event Form</h3>
          <p>Create a new event</p>
        </Link>
        <Link to="/userprofile" className="home-card">
          <h3>User Profile</h3>
          <p>View and edit your profile</p>
        </Link>
        <Link to="/volunteerhistory" className="home-card">
          <h3>Volunteer History</h3>
          <p>View your volunteer history</p>
        </Link>
        <Link to="/volunteerform" className="home-card">
          <h3>Volunteer Form</h3>
          <p>Sign up as a volunteer</p>
        </Link>
      </div>
      <AnyComponent />
    </>
  );
};

export default Home;
