import express from 'express';
import { signup, login, logout, onboard } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const app = express();
const Router = express.Router();

Router.post('/signup',signup);
Router.post('/login', login);
Router.post('/logout', logout);

Router.post("/onboarding",protectRoute ,onboard);

// forget-password and reset-password routes can be added here



// check if user is logged in 
Router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default Router;