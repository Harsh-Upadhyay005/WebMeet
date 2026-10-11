import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { friendActionLimiter } from '../middleware/rateLimiters.js';
import { 
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getFriendRequests,
    getRecommendedUsers, 
    getOutgoingFriendReqquests,
    getMyFriends,
    sendFriendRequest,
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", friendActionLimiter, sendFriendRequest);
router.put("/friend-request/:id/accept", friendActionLimiter, acceptFriendRequest);
router.delete("/friend-request/:id/reject", friendActionLimiter, rejectFriendRequest);
router.delete("/friends/:id", friendActionLimiter, removeFriend);

router.get("/friend-request", getFriendRequests);
router.get("/outgoing-friend-request", getOutgoingFriendReqquests);

export default router;