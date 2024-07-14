import React, { useState, useEffect } from 'react';
import MultiSelect from 'multiselect-react-dropdown';
import DatePicker from 'react-multi-date-picker';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import './UserProfile.css';

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [skills, setSkills] = useState([]);
  const [preferences, setPreferences] = useState('');
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false); 

  const navigate = useNavigate();

  const handleDateChange = (selectedDates) => {
    // Convert each date to a Date object if it isn't one already
    const formattedDates = selectedDates.map(date => {
      const parsedDate = date instanceof Date ? date : new Date(date);
      return parsedDate.toISOString().split('T')[0];
    });
  
    setAvailabilities(formattedDates);
  };
  
  const stateOptions = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
  ];

  const skillOptions = [
    { value: 'Public Speaking', label: 'Public Speaking' },
    { value: 'Event Planning', label: 'Event Planning' },
    { value: 'Customer Service', label: 'Customer Service' },
    { value: 'First Aid/CPR', label: 'First Aid/CPR' },
    { value: 'Logistics', label: 'Logistics' },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = sessionStorage.getItem('authToken');
      const url = 'http://localhost:3000/api/profile';
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      
        if (response.ok) {
          const userData = await response.json();
          console.log(userData);
          setFullName(userData.FullName);
          setAddress1(userData.Address1);
          setAddress2(userData.Address2 || '');
          setCity(userData.City);
          setSelectedState(userData.State);
          setZipCode(userData.ZipCode);
          setPreferences(userData.Preferences || '');
          setSkills(JSON.parse(userData.Skills).map(skill => ({ value: skill, label: skill })));
          
          // Parse the Availability JSON string into an array
          setAvailabilities(JSON.parse(userData.Availability).map(date => new Date(date).toISOString().split('T')[0]));
        } else {
          throw new Error('Failed to fetch user profile data');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    fetchUserProfile();
  }, []);
  

  const validateForm = () => {
    const newErrors = {};

    if (!fullName || fullName.trim().length === 0) {
      newErrors.fullName = 'Full name is required';
    } else if (!/^[A-Za-z\s]+$/.test(fullName)) {
      newErrors.fullName = 'Full name should only contain letters and spaces';
    } else if (fullName.length > 50) {
      newErrors.fullName = 'Full name cannot exceed 50 characters';
    }

    if (!address1 || address1.trim().length === 0) {
      newErrors.address1 = 'Address 1 is required';
    } else if (address1.length > 100) {
      newErrors.address1 = 'Address 1 cannot exceed 100 characters';
    }

    if (address2 && address2.length > 100) {
      newErrors.address2 = 'Address 2 cannot exceed 100 characters';
    }

    if (!city || city.trim().length === 0) {
      newErrors.city = 'City is required';
    } else if (!/^[A-Za-z\s]+$/.test(city)) {
      newErrors.city = 'City should only contain letters and spaces';
    } else if (city.length > 100) {
      newErrors.city = 'City cannot exceed 100 characters';
    }

    if (!selectedState) {
      newErrors.state = 'State is required';
    }

    if (!zipCode || zipCode.trim().length === 0) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{5,9}$/.test(zipCode)) {
      newErrors.zipCode = 'Zip code must be between 5 to 9 digits';
    }

    if (skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    if (availabilities.length === 0) {
      newErrors.availabilities = 'At least one date is required for availability';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const formatDateStrings = (dateStrings) => {
    return dateStrings.map(dateString => {
      // Convert the string to a Date object
      const date = new Date(dateString);
      
      // Format the date to 'YYYY-MM-DD'
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
  
      return `${year}-${month}-${day}`;
    });
  };

  const handleProfileSave = async () => {
   console.log("hello from edit profile");
    if (validateForm()) {
      const token = sessionStorage.getItem('authToken');
      const url = 'http://localhost:3000/api/profile'; // Ensure this matches your backend
  
      const mappedSkills = skills.map(skill => skill.label);
      console.log(availabilities);
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName,
            address1,
            address2,
            city,
            state: selectedState,
            zipCode,
            skills: mappedSkills, // Convert to JSON string
            preferences,
            availability: availabilities,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Profile updated successfully:', data);
          setIsEditMode(false);
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };
  
  


  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
  };


  return (
    <>
      < NavBar/>
    <div className="UserProfile">
        <div className="user-profile-buttons">
        {!isEditMode ? (
          <button className="btn btn-primary" onClick={handleEditClick}>
            Edit
          </button>
        ) : (
          <>
            <button className="btn btn-success" onClick={handleProfileSave}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={handleCancelClick}>
              Cancel
            </button>
          </>
        )}
      </div>
      <div className='user-profile-container'>
        <div className="user-profile-header">
          <div className="user-profile-text">Edit Your Profile</div>
          <div className="user-profile-underline"></div>
        </div>
        <div className="user-profile-inputs">
          <div className="user-profile-input">
            <label htmlFor="fullName">Full Name <span className="required">*</span></label>
            <input 
              type='text' 
              id='fullName'
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              disabled={!isEditMode}
              placeholder='Full Name (Max 50 characters)'
              maxLength={50}
              required
              aria-required="true" 
              className={`user-profile-input ${errors.fullName && 'error'}`} // Dynamic class for styling
            />
            {errors.fullName && <div className="user-profile-error">{errors.fullName}</div>}
          </div>

          <div className="user-profile-input">
            <label htmlFor="address1">Address 1 <span className="required">*</span></label>
            <input 
              type='text' 
              id='address1'
              value={address1} 
              onChange={(e) => setAddress1(e.target.value)} 
              disabled={!isEditMode}
              placeholder='Address 1 (Max 100 characters)'
              maxLength={100}
              required
              aria-required="true" 
              className={`user-profile-input ${errors.address1 && 'error'}`} // Dynamic class for styling
            />
            {errors.address1 && <div className="user-profile-error">{errors.address1}</div>}
          </div>

          <div className="user-profile-input">
            <label htmlFor="address2">Address 2</label>
            <input 
              type='text' 
              id='address2'
              value={address2} 
              onChange={(e) => setAddress2(e.target.value)} 
              disabled={!isEditMode}
              placeholder='Address 2 (Max 100 characters)'
              maxLength={100}
              className="user-profile-input" // Added class for styling
            />
            {errors.address2 && <div className="user-profile-error">{errors.address2}</div>}
          </div>

          <div className="user-profile-input">
            <label htmlFor="city">City <span className="required">*</span></label>
            <input 
              type='text' 
              id='city'
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              disabled={!isEditMode}
              placeholder='City (Max 100 characters)'
              maxLength={100}
              required
              aria-required="true" 
              className={`user-profile-input ${errors.city && 'error'}`} // Dynamic class for styling
            />
            {errors.city && <div className="user-profile-error">{errors.city}</div>}
          </div>

          <div className="user-profile-input">
            <label htmlFor="state">State <span className="required">*</span></label>
            <select
              id="state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={!isEditMode}
              required
              aria-required="true"
              className={`user-profile-input ${errors.state && 'error'}`}
            >
              <option value="" disabled>Select State</option>
              {stateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.state && <div className="user-profile-error">{errors.state}</div>}
          </div>

          <div className="user-profile-input">
            <label htmlFor="zipCode">Zip Code <span className="required">*</span></label>
            <input 
              type='text' 
              id='zipCode'
              value={zipCode} 
              onChange={(e) => setZipCode(e.target.value)} 
              disabled={!isEditMode}
              placeholder='Zip Code (5-9 digits)'
              maxLength={9}
              required
              aria-required="true" 
              className={`user-profile-input ${errors.zipCode && 'error'}`} // Dynamic class for styling
            />
            {errors.zipCode && <div className="user-profile-error">{errors.zipCode}</div>}
          </div>

          <div className="user-profile-input">
            <label htmlFor="skills">Skills <span className="required">*</span></label>
            <MultiSelect
              options={skillOptions} // Assuming skillOptions is defined with skill options
              selectedValues={skills}
              onSelect={(selectedList) => setSkills(selectedList)}
              onRemove={(selectedList) => setSkills(selectedList)}
              displayValue="label"
              className={`user-profile-input ${errors.skills && 'error'}`} // Dynamic class for styling
              disabled={!isEditMode}
            />
            {errors.skills && <div className="user-profile-error">{errors.skills}</div>}
          </div>

          <div className="user-profile-input">
            <label htmlFor="preferences">Preferences</label>
            <textarea
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              disabled={!isEditMode}
              placeholder="Preferences (optional)"
              rows={4}
              maxLength={500}
              className="user-profile-input"
            />
          </div>

          <div className="user-profile-input">
            <label htmlFor="availabilities">Availabilities <span className="required">*</span></label>
            <DatePicker
              id="availabilities"
              value={availabilities.map(date => new Date(date))}
              onChange={handleDateChange} // Use the conversion function on change
              disabled={!isEditMode}
              multiple
              className={`user-profile-input ${errors.availabilities && 'error'}`} // Dynamic class for styling
            />
            {errors.availabilities && <div className="user-profile-error">{errors.availabilities}</div>}
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default EditProfile;