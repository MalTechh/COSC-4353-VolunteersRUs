// controllers/authController.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { sign } = jwt;

// In-memory user storage
let users = [];

// Registration handler
export const register = async (req, res) => {
  const { email, passwordhash, username, admin } = req.body;

  console.log(admin);

  // Basic validation
  if (!email || !passwordhash || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Validate password length
  if (passwordhash.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  // Validate username length
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  const UserType = admin === 1 ? 'Admin' : 'Volunteer';

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(passwordhash, 10);

    // Create user object
    const user = {
      UserID: users.length + 1,
      email,
      passwordhash: hashedPassword,
      username,
      UserType,
    };
    console.log("final user type: ", UserType);
    // Add user to the in-memory storage
    users.push(user);

    // Sign the token with UserID and UserType
    const token = sign({ UserID: user.UserID, UserType: user.UserType }, 'your_jwt_secret');

    // Respond with the token
    res.status(201).json({ token });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: 'Error registering user.' });
  }
};


export const getUserById = async (req, res) => {
  // Assuming the JWT is sent in the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  try {
    // Verify the token and extract user info
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = users.find((u) => u.UserID === decoded.UserID);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Send back the user's data
    res.json({
      UserID: user.UserID,
      username: user.username,
      email: user.email,
      UserType: user.UserType,
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};


export const login = async (req, res) => {
  const { email, passwordhash } = req.body;

  try {
    // Find the user by email in the hardcoded users array
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(passwordhash, user.passwordhash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Retrieve the UserType from the user
    const { UserType, UserID } = user;

    // Sign the token with UserID and UserType
    const token = sign({ UserID, UserType }, config.jwtSecret);

    // Respond with a success message and the token
    res.json({ message: 'Login successful!', token });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in.' });
  }
};
