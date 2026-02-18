import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import jscookie from 'cookie-parser';
import connectDB from './config/DB.js';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';
import appointmentRoutes from './routes/appointment.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();


app.use(cors({origin: process.env.ALLOWED_ORIGINS?.split(',') || [], credentials: true}));
app.use(bodyParser.json());
app.use(jscookie());

//server content
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/appointments', appointmentRoutes);