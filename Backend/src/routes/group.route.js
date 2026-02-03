import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
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
router.post("/", createGroup);
router.get("/", getMyGroups);
router.get("/:id", getGroupById);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

// Member management
router.post("/:id/members", addMembers);
router.delete("/:id/members/:memberId", removeMember);

export default router;
