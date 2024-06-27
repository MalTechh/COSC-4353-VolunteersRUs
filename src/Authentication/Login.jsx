import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();


    if (!email.trim()) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: 'Email is required.'
      }));
      return;
    }

    if (!password.trim()) {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: 'Password is required.'
      }));
      return;
    }


    setErrors({});

    
    alert('Login functionality is disabled in this demo.');
  };

  return (
    <div className="auth-background">
      <div className="login-container">
        <div className="signup-header-container">
          <div className="signup-header">Login</div>
          <div className="signup-underline"></div>
        </div>

        <div className="login-inputs">
          <div className="input">
            <label htmlFor="Email">Username</label>
            <input
              type="text"
              id="Email"
              placeholder="Email"
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
              type="password"
              id="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
        </div>

        <div className="login-submit-container">
          <button className="authentication-submit" onClick={handleSubmit}>
            Login
          </button>
          <p>
            Don't have an account? <Link to="/signup">Click here to sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
