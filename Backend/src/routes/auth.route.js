import express from 'express';
import { signup, login, logout, onboard, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { upsertStreamUser } from '../lib/stream.js';
import { authLimiter, profileLimiter } from '../middleware/rateLimiters.js';

const Router = express.Router();

Router.post('/signup', authLimiter, signup);
Router.post('/login', authLimiter, login);
Router.post('/logout', logout);

Router.post("/onboarding", protectRoute, profileLimiter, onboard);
Router.put("/profile", protectRoute, profileLimiter, updateProfile);

// check if user is logged in 
Router.get("/me", protectRoute, async (req, res) => {
    try {
        // Ensure user exists in Stream
        await upsertStreamUser({
            id: req.user._id.toString(),
            name: req.user.fullName,
            image: req.user.profilePic || "",
        });
    } catch (streamError) {
        console.error("Error upserting Stream user in /me:", streamError);
    }
    
    res.status(200).json({ success: true, user: req.user });
});

export default Router;