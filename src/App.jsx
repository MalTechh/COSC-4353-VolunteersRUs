
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Authentication/Signup';
import Login from './Authentication/Login';
import EventForm from './Event_Form/Event_Form';
import UserProfile from './User_Profile/UserProfile.jsx'
import Notification from './Notification.jsx';
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
        </Routes>
      </div>
    </Router>
  );

}

export default App;
