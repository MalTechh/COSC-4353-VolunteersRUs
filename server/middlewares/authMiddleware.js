// middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';

const { verify } = jwt;

export default function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }
  try {
    const decoded = verify(token, 'your_jwt_secret');
    req.user = {
      id: decoded.UserID,
      type: decoded.UserType
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
}