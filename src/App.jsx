
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Authentication/Signup';
import AdminSignUp from './Authentication/AdminSignUp.jsx'
import Login from './Authentication/Login';
import Home from './Homepage/Home';
import EventForm from './Event_Form/Event_Form';
import UserProfile from './User_Profile/UserProfile.jsx'
import Notification from './Notification.jsx';
import VolunteerForm from './Volunteer_Form/Volunteer_Form';
import Volunteer_History from './Volunteer_History/Volunteer_History.jsx';
import EditProfile from './User_Profile/EditProfile.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Notification />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/adminsignup" element={<AdminSignUp/>} />
          <Route path="/" element={<Login />} />
          <Route path="/eventform" element={<EventForm />} />  
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/volunteerform" element={<VolunteerForm />} />
          <Route path="/volunteerhistory" element={<Volunteer_History />} />
        </Routes>
      </div>
    </Router>
  );

}

export default App;
