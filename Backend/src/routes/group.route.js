import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { groupMutationLimiter } from '../middleware/rateLimiters.js';
import {
    createGroup,
    getMyGroups,
    getGroupById,
    updateGroup,
    addMembers,
    removeMember,
    deleteGroup,
} from '../controllers/group.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Group CRUD operations
router.post("/", groupMutationLimiter, createGroup);
router.get("/", getMyGroups);
router.get("/:id", getGroupById);
router.put("/:id", groupMutationLimiter, updateGroup);
router.delete("/:id", groupMutationLimiter, deleteGroup);

// Member management
router.post("/:id/members", groupMutationLimiter, addMembers);
router.delete("/:id/members/:memberId", groupMutationLimiter, removeMember);

export default router;
