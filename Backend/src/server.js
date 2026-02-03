import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import groupRoutes from './routes/group.route.js';
import path from 'path';

import {connetdb} from "./lib/db.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
const isProduction = process.env.NODE_ENV === 'production';

// CORS Configuration - MUST be before other middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    process.env.CLIENT_URL,
    'https://web-meet-liart.vercel.app',
    'https://webmeet-to9x.onrender.com'
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['set-cookie'],
    maxAge: 86400, // 24 hours - cache preflight requests
};

// Apply CORS before everything else
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Security headers (after CORS)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
}));

// Enable gzip compression for faster responses
app.use(compression());

// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // increased limit for better UX
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health' || req.method === 'OPTIONS',
});

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // increased to 20 for better UX
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api', limiter);

// Body parser with size limit to prevent payload attacks
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Routes with rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use("/api/chat", chatRoutes);
app.use("/api/groups", groupRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Global error handler (must be after routes)
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    // Don't expose error details in production
    if (isProduction) {
        res.status(err.status || 500).json({ 
            message: 'Internal server error' 
        });
    } else {
        res.status(err.status || 500).json({ 
            message: err.message,
            stack: err.stack 
        });
    }
});

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connetdb();

});
