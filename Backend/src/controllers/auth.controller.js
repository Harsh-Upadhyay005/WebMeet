import { upsertStreamUser } from '../lib/stream.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
export async function signup(req, res) {
    const { fullName, email, password } = req.body;
    try {
        
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        const newUser = await User.create({
            fullName: fullName,
            email: email,
            password: password,
            profilePic: randomAvatar,
        });

        try {
            await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || "",
        });
        }
        catch (error) {
            console.error("Error upserting Stream user:", error);
        }

        const token = jwt.sign({ userid: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" });
        res.cookie("jwt", token, {
            maxAge: 5 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-domain in production
        });

        res.status(201).json({success: true, user: newUser, token});
        

    } catch (error) {
        console.error("Signup Error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already in use" });
        }
        return res.status(500).json({ message: "Server Error" });

    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // Upsert Stream user on login to ensure they exist in Stream
        try {
            await upsertStreamUser({
                id: user._id.toString(),
                name: user.fullName,
                image: user.profilePic || "",
            });
        } catch (streamError) {
            console.error("Error upserting Stream user on login:", streamError.message);
        }

        const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" });
        res.cookie("jwt", token, {
            maxAge: 5 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-domain in production
        });
        res.status(200).json({ success: true, user: user, token });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "internal Server Error" });
    }
}
export async function logout(req, res) {
    try {
        // Clear the JWT cookie with same options as when it was set
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export async function onboard(req, res) {
    try {
        const userId = req.user._id;
        const {fullName, bio, nativeLanguage, location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required for onboarding",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !location && "location",
            ].filter(Boolean),
            });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
            ...req.body,
            isOnboarded: true,
            },
            { new: true }
        );
        if(!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        try {
            await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || "",
        });
        }
        catch (streamError) {
            console.error("Error upserting Stream user:", streamError.message);
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Onboarding Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateProfile(req, res) {
    try {
        const userId = req.user._id;
        const { fullName, bio, nativeLanguage, location, profilePic } = req.body;

        if (!fullName || !bio || !nativeLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fullName,
                bio,
                nativeLanguage,
                location,
                profilePic,
            },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });
        } catch (streamError) {
            console.error("Error upserting Stream user:", streamError.message);
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}