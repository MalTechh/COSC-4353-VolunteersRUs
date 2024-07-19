// app.js

import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js'
import eventRoutes from './routes/eventVolunteerRoutes.js'
import cors from 'cors';




const app = express();

app.use(bodyParser.json());



app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type','Authorization'],
  }));

app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', eventRoutes);




export default app;