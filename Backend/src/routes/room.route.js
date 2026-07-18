import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    createRoom,
    getPublicRooms,
    getRoomById,
    joinRoom,
    leaveRoom,
    deleteRoom,
    getMyRooms,
    createDirectCallLink,
    joinByRoomCode,
    admitFromWaitingRoom,
} from '../controllers/room.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Public room routes
router.post('/create', createRoom);
router.get('/public', getPublicRooms);
router.get('/my-rooms', getMyRooms);
router.get('/:roomId', getRoomById);
router.post('/:roomId/join', joinRoom);
router.post('/:roomId/leave', leaveRoom);
router.delete('/:roomId', deleteRoom);

// Waiting room management
router.post('/:roomId/admit', admitFromWaitingRoom);

// Direct call link route
router.post('/direct-call/create', createDirectCallLink);

// Join by room code
router.post('/join-by-code/:roomCode', joinByRoomCode);

export default router;
