import React, { useState } from 'react';
import MultiSelect from 'multiselect-react-dropdown';
import DatePicker from 'react-multi-date-picker';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
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

  const navigate = useNavigate();
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
  const skillsOptions = [
    { value: 'Public Speaking', label: 'Public Speaking' },
    { value: 'Event Planning', label: 'Event Planning' },
    { value: 'Customer Service', label: 'Customer Service' },
    { value: 'First Aid/CPR', label: 'First Aid/CPR' },
    { value: 'Logistics', label: 'Logistics' },
    // Add more skills as needed
  ];

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

 

  const handleProfileSave = async () => {
    if (validateForm()) {
      const token = sessionStorage.getItem('authToken');
      const url = 'http://localhost:3000/api/profile';

      const mappedSkills = skills.map(skill => skill.value);
      
      // Format availabilities to YYYY-MM-DD format
      const formattedAvailabilities = availabilities.map(date => date.format('YYYY-MM-DD'));

      try {
        const response = await fetch(url, {
          method: 'POST',
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
            skills: mappedSkills,
            preferences,
            availability: formattedAvailabilities,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Profile saved successfully:', data);
          resetForm();
          navigate('/home');
         
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error saving profile:', error);
        // Optionally, set error state or show error message to user
      }
    }
  };
  
  
  const resetForm = () => {
    setFullName('');
    setAddress1('');
    setAddress2('');
    setCity('');
    setSelectedState('');
    setZipCode('');
    setSkills([]);
    setPreferences('');
    setAvailabilities([]);
    setErrors({});
  };
  

  

  return (
    <div className="UserProfile">
      <div className='user-profile-container'>
        <div className="user-profile-header">
          <div className="user-profile-text">Complete Your Profile</div>
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
              placeholder='Zip Code (Max 9 characters, Min 5 characters)'
              maxLength={9}
              required
              aria-required="true" 
              className={`user-profile-input ${errors.zipCode && 'error'}`} // Dynamic class for styling
            />
            {errors.zipCode && <div className="user-profile-error">{errors.zipCode}</div>}
          </div>

          <div className="user-profile-input">
            <label htmlFor="availability">Availability <span className="required">*</span></label>
            <div className="user-profile-date-picker">
              <DatePicker
                multiple
                id='available'
                value={availabilities}
                onChange={setAvailabilities}
                format="MM/DD/YYYY"
                placeholder="Select Dates"
                className={`user-profile-date-input user-profile-input ${errors.availabilities && 'error'}`} // Dynamic class for styling
              />
            </div>
            {errors.availabilities && <div className="user-profile-error">{errors.availabilities}</div>}
          </div>

          <div className="user-profile-input">
            <label htmlFor="preferences">Preferences</label>
            <textarea 
              id='preferences'
              value={preferences} 
              onChange={(e) => setPreferences(e.target.value)} 
              placeholder='Preferences (Optional)'
              className="user-profile-input user-profile-preferences-textarea" // Updated class for styling
            />
          </div>
        </div>

        <div className="user-profile-inputs user-profile-skills">
          <div className="user-profile-input">
            <label htmlFor="skills">Skills <span className="required">*</span></label>
            <MultiSelect
              options={skillsOptions}
              displayValue="label"
              selectedValues={skills}
              onSelect={setSkills}
              onRemove={setSkills}
              placeholder='Select Skills'
              id="skills"
              required
              aria-required="true"
              showCheckbox
              className={`multiselect-react-dropdown user-profile-input ${errors.skills && 'error'}`} // Dynamic class for styling
              classNamePrefix="multiselect"
            />
            {errors.skills && <div className="user-profile-error">{errors.skills}</div>}
          </div>
        </div>
        
        <div className="user-profile-submit-container">
          <button className="user-profile-submit" onClick={handleProfileSave}>Save Profile</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
