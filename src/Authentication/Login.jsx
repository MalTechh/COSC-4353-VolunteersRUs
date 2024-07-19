import React, { useState } from 'react';
import './LogIn.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const url = 'http://localhost:3000/api/login'; 
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        passwordhash: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);

      sessionStorage.setItem('authToken', data.token);

      navigate('/home');
      // Handle success case (redirect, show message, etc.)
    } else {
      console.error('Error logging in:', response.statusText);
      // Handle error case (display error message, retry, etc.)
    }
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
            <label htmlFor="Email">Email</label>
            <input
              type="text"
              id="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
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
          </div>
        </div>

        <div className="login-submit-container">
          <button className="submit" onClick={handleLogin}>
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
