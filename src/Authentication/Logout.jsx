import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';  // Import CSS for the logout button

const Logout = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <button className="logout-button" onClick={handleLogout}>Logout</button>
  );
};

export default Logout;