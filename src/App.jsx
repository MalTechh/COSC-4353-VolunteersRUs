
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Authentication/Signup';
import Login from './Authentication/Login';
import EventForm from './Event_Form/Event_Form';
import UserProfile from './User_Profile/UserProfile.jsx'
import Notification from './Notification.jsx';
import VolunteerForm from './Volunteer_Form/Volunteer_Form';
import Volunteer_History from './Volunteer_History/Volunteer_History.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Notification />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/eventform" element={<EventForm />} />  
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/volunteerform" element={<VolunteerForm />} />
          <Route path="/volunteerhistory" element={<Volunteer_History />} />
        </Routes>
      </div>
    </Router>
  );

}

export default App;
