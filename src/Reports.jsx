import React from 'react';
import Navbar from './componenets/navbar.jsx';
import './Reports.css';
import axios from 'axios';

const Reports = () => {

  const handleVolunteerReport = async () => {
    const token = sessionStorage.getItem('authToken');
    try {
      // Make a GET request to fetch volunteer info
      const response = await axios.get('http://localhost:3000/api/fetchVolunteerInfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const volunteerData = response.data.history;
  
      if (volunteerData && volunteerData.length > 0) {
        // Create CSV content
        const csvRows = [];
        const headers = ['Description', 'Event Date', 'Event Name', 'Full Name', 'Location', 'Required Skills', 'Status', 'Urgency'];
        csvRows.push(headers.join(',')); // Add headers to the CSV
  
        // Loop through the data and create rows
        volunteerData.forEach(activity => {
          const row = [
            activity.Description,
            new Date(activity.EventDate).toLocaleDateString(), // Format date if needed
            activity.EventName,
            activity.FullName,
            activity.Location,
            activity.RequiredSkills,
            activity.Status,
            activity.Urgency
          ];
          csvRows.push(row.join(',')); // Add row to CSV
        });
  
        // Create a Blob and trigger download
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'Volunteer_Activity_Report.csv');
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.log('No volunteer history found.');
      }
    } catch (error) {
      console.error('Error fetching volunteer info:', error);
    }
  };

  const fetchEventInfo = async () => {
    const token = sessionStorage.getItem('authToken');
    try {
      // Make a GET request to fetch volunteer info
      const response = await axios.get('http://localhost:3000/api/fetchEventInfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const volunteerData = response.data.history;
  
      if (volunteerData && volunteerData.length > 0) {
        // Create CSV content
        const csvRows = [];
        const headers = ['Description', 'Event Date', 'Event Name', 'Full Name', 'Location', 'Required Skills', 'Status', 'Urgency'];
        csvRows.push(headers.join(',')); // Add headers to the CSV
  
        // Loop through the data and create rows
        volunteerData.forEach(activity => {
          const row = [
            activity.Description,
            new Date(activity.EventDate).toLocaleDateString(), // Format date if needed
            activity.EventName,
            activity.FullName,
            activity.Location,
            activity.RequiredSkills,
            activity.Status,
            activity.Urgency
          ];
          csvRows.push(row.join(',')); // Add row to CSV
        });
  
        // Create a Blob and trigger download
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'Event_Management_Report.csv');
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.log('No volunteer history found.');
      }
    } catch (error) {
      console.error('Error fetching volunteer info:', error);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="reports-container">
        <button className="report-button" onClick={handleVolunteerReport}>
          Generate Volunteer Activity Report
        </button>
        <button className="report-button" onClick={fetchEventInfo}>
          Generate Event Reports
        </button>
      </div>
    </>
  );
};

export default Reports;
