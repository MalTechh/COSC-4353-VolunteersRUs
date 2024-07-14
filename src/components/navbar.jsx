import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../Authentication/Logout.jsx";
import "./navbar.css";  // Import CSS for the navbar

function NavBar() {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = sessionStorage.getItem('authToken');

      if (token) {
        try {
          // Decode the JWT token
          const decodedToken = JSON.parse(atob(token.split('.')[1]));

          // Extract UserType from the token
          const { UserType } = decodedToken;

          // Set user role based on UserType
          if (UserType) {
            setUserRole(UserType === 'Volunteer' ? 'Role: Volunteer' : 'Role: Admin'); // Adjust as per your UserType values
          } else {
            setUserRole('Role: Unknown');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {
        console.warn('No auth token found in sessionStorage.');
      }
    };

    fetchUserRole();
  }, []);

  const handleNavigateToHome = () => {
    navigate('/home');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-role">
            {userRole && <span>{userRole}</span>}
          </div>
          <div className="nav-title" onClick={handleNavigateToHome}>
            VolunteersRUs
          </div>
          <div className="nav-logout">
            <Logout />
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
