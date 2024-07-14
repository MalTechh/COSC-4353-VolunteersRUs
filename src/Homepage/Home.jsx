import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/navbar.jsx';
import axios from 'axios';

import { notify } from '../Notification.jsx';
import './Home.css';  // Import the CSS file for styling

const Home = () => {
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log(response.data);
          setUsername(response.data.username);
          setUserType(response.data.UserType);
        } else {
          notify('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        notify('Error fetching user data');
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      < NavBar/>
      <div className="home-container">
        <p className="welcome-message">Welcome</p>
      </div>

      <div className="home-cards">
        {userType === 'Volunteer' ? (
          <>
            <Link to="/volunteerhistory" className="home-card">
              <h3>Volunteer History</h3>
            </Link>
            <Link to="/editprofile" className="home-card">
              <h3>Edit User Profile</h3>
            </Link>
          </>
        ) : userType === 'Admin' ? (
          <>
            <Link to="/volunteerform" className="home-card">
              <h3>Volunteer Form</h3>
            </Link>
            <Link to="/eventform" className="home-card">
              <h3>Event Form</h3>
            </Link>
            <Link to="/editprofile" className="home-card">
              <h3>Edit User Profile</h3>
            </Link>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Home;
