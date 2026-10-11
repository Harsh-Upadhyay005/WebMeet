import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { profileLimiter } from '../middleware/rateLimiters.js';
import { uploadAvatar } from '../lib/supabase.js';
import { upsertStreamUser } from '../lib/stream.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/avatar', protectRoute, profileLimiter, async (req, res) => {
    try {
        const { imageDataUrl } = req.body;
        const userId = req.user._id.toString();

        if (!imageDataUrl) {
            return res.status(400).json({ message: 'imageDataUrl is required' });
        }

        if (!imageDataUrl.startsWith('data:image/')) {
            return res.status(400).json({ message: 'Invalid image format' });
        }

        // Rough size guard — base64 string for a 1 MB file is ~1.37 MB
        if (imageDataUrl.length > 2 * 1024 * 1024) {
            return res.status(413).json({ message: 'Image too large (max ~1.5 MB)' });
        }

        const publicUrl = await uploadAvatar(imageDataUrl, userId);

        // Persist the Supabase URL on the user document
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: publicUrl },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Keep Stream profile in sync
        try {
            await upsertStreamUser({
                id: userId,
                name: updatedUser.fullName,
                image: publicUrl,
            });
        } catch (streamErr) {
            console.error('Stream upsert after avatar upload:', streamErr.message);
        }

        res.status(200).json({ success: true, profilePic: publicUrl, user: updatedUser });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ message: error.message || 'Upload failed' });
    }
});

export default router;
