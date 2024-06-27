import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSignUp = () => {
    let formIsValid = true;
    const newErrors = { email: '', password: '' };

    // Email validation (basic check for @ and .)
    if (!email || !email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please enter a valid email address.';
      formIsValid = false;
    }

    // Password validation (at least 8 characters)
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
      formIsValid = false;
    }

    // Update errors state if there are validation issues
    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    // Proceed with sign-up logic (mocked with an alert)
    alert('Form submitted successfully!');
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
            <label htmlFor="Email">Username</label>
            <input 
              type='email'
              id='Email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              aria-required="true"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="input">
            <label htmlFor="Password">Password</label>
            <input 
              type='password'
              id='Password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              aria-required="true"
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
        </div>

        <div className="signup-submit-container">
          <button className="sign-authentication-submit" onClick={handleSignUp}>
            Create Account
          </button>
          <p><Link to="/login">Click here to login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
