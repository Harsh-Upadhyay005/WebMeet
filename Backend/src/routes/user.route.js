import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
    acceptFriendRequest,
    getFriendRequests,
    getRecommendedUsers, 
    getOutgoingFriendReqquests,
    getMyFriends,
    sendFriendRequest,
} from '../controllers/user.controller.js';
import { get } from 'mongoose';

const router = express.Router();

// apply auth middelware to all routes in this router
router.use(protectRoute);


// Define user-related routes here
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
// router.post("/friend-request/:id/reject", rejectFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqquests);

export default router;