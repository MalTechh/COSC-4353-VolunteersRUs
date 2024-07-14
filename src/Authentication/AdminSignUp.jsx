import React, { useState } from 'react';
import './Signup.css'
import { Link, useNavigate } from 'react-router-dom';


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const admin = 1;
    console.log(email);
    const url = 'http://localhost:3000/api/register'; // Adjust the URL based on your server setup
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        passwordhash: password,
        username,
        admin,
      }),
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log('User registered successfully:', data);

      sessionStorage.setItem('authToken', data.token);

      navigate('/userprofile');
      // Handle success case (redirect, show message, etc.)
    } else {
      console.error('Error signing up:', response.statusText);
      // Handle error case (display error message, retry, etc.)
    }
  };

  return (
    <div className="auth-background">
      <div className="signup-container">
        <div className="signup-header-container">
          <div className="signup-header">Sign Up</div>
          <div className="signup-underline"></div>
        </div>

        <div className="signup-inputs">
          <div className="input">
            <label htmlFor="Email">Email</label>
            <input 
              type='text'
              id='Email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              aria-required="true"
            />
          </div>
          
          <div className="input">
            <label htmlFor="Password">Password</label>
            <input 
              type='password'
              id='Password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              aria-required="true"
            />
          </div>

          <div className="input">
            <label htmlFor="Username">Username</label>
            <input 
              type='text'
              id='Username'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              aria-required="true"
            />
          </div>
        </div>  

        <div className="signup-submit-container">
          <button className="submit" onClick={handleSignUp}>Create Account</button>
          <p><Link to="/">Click here to login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;