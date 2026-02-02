import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded || !decoded.userid) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const user = await User.findById(decoded.userid).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }
        req.user = user;
        next();

    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(401).json({ message: "Internal Server Error" });
    }
};