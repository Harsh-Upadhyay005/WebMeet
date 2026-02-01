import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import path from 'path';

import {connetdb} from "./lib/db.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// CORS Configuration for production and development
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL,
    'https://web-meet-liart.vercel.app' // Replace with your actual Vercel domain after deployment
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow all origins that match the pattern for development and production
        if (allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '').replace('http://', ''))) || 
            origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // allow frontend to send cookies
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use("/api/chat", chatRoutes); // Use chatRoutes for chat-related endpoints

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connetdb();

});
