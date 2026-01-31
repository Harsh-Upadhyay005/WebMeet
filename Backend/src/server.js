import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';




import {connetdb} from "./lib/db.js";
import cookieParser from 'cookie-parser';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // allow frontend to send cookies
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use("/api/chat", chatRoutes); // Use chatRoutes for chat-related endpoints
app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connetdb();

});
