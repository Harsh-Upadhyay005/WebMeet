import Room from '../models/Room.js';
import { generateStreamToken } from '../lib/stream.js';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

// Generate random 6-character room code
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Create a new meeting room
export async function createRoom(req, res) {
    try {
        const { 
            name, 
            description, 
            maxParticipants, 
            tags,
            password,
            waitingRoomEnabled,
            recordingEnabled,
            allowScreenSharing,
            muteParticipantsOnEntry,
            allowParticipantsToUnmute,
            scheduledTime,
            duration,
            meetingType,
            isPublic,
        } = req.body;
        
        const creator = req.user._id;

        // Generate unique room ID and room code
        const roomId = nanoid(10);
        let roomCode = generateRoomCode();
        
        // Ensure room code is unique
        let existingRoom = await Room.findOne({ roomCode });
        while (existingRoom) {
            roomCode = generateRoomCode();
            existingRoom = await Room.findOne({ roomCode });
        }

        // Hash password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Set expiry based on meeting type
        let expiresAt;
        if (meetingType === 'scheduled' && scheduledTime) {
            // Scheduled meetings expire after duration + 1 hour buffer
            const scheduledDate = new Date(scheduledTime);
            expiresAt = new Date(scheduledDate.getTime() + (duration + 60) * 60 * 1000);
        } else {
            // Instant meetings expire in 24 hours
            expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }

        const room = await Room.create({
            name,
            description,
            roomId,
            roomCode,
            creator,
            maxParticipants: maxParticipants || 100,
            password: hashedPassword,
            waitingRoomEnabled: waitingRoomEnabled || false,
            recordingEnabled: recordingEnabled || false,
            allowScreenSharing: allowScreenSharing !== false, // default true
            muteParticipantsOnEntry: muteParticipantsOnEntry || false,
            allowParticipantsToUnmute: allowParticipantsToUnmute !== false, // default true
            scheduledTime: scheduledTime || null,
            duration: duration || 60,
            meetingType: meetingType || 'instant',
            isScheduled: meetingType === 'scheduled',
            isPublic: isPublic !== false, // default true
            tags: tags || [],
            participants: [creator],
            expiresAt,
        });

        const populatedRoom = await Room.findById(room._id)
            .populate('creator', 'fullName profilePic')
            .populate('participants', 'fullName profilePic');

        res.status(201).json({
            message: "Meeting created successfully",
            room: populatedRoom,
        });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get all active public rooms
export async function getPublicRooms(req, res) {
    try {
        const { limit = 20, meetingType } = req.query;

        const filter = {
            isPublic: true,
            isActive: true,
            expiresAt: { $gt: new Date() },
        };

        if (meetingType) {
            filter.meetingType = meetingType;
        }

        const rooms = await Room.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate('creator', 'fullName profilePic')
            .populate('participants', 'fullName profilePic');

        res.status(200).json(rooms);
    } catch (error) {
        console.error("Error fetching public rooms:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get room by ID or room code
export async function getRoomById(req, res) {
    try {
        const { roomId } = req.params;

        const room = await Room.findOne({ 
            $or: [{ roomId }, { roomCode: roomId.toUpperCase() }],
            isActive: true 
        })
            .populate('creator', 'fullName profilePic')
            .populate('participants', 'fullName profilePic')
            .populate('waitingRoom', 'fullName profilePic');

        if (!room) {
            return res.status(404).json({ message: "Meeting not found or expired" });
        }

        // Don't send password hash to client
        const roomData = room.toObject();
        roomData.hasPassword = !!roomData.password;
        delete roomData.password;

        res.status(200).json(roomData);
    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Join a room (with password verification and waiting room support)
export async function joinRoom(req, res) {
    try {
        const { roomId } = req.params;
        const { password } = req.body;
        const userId = req.user._id;

        const room = await Room.findOne({ 
            $or: [{ roomId }, { roomCode: roomId.toUpperCase() }],
            isActive: true 
        });

        if (!room) {
            return res.status(404).json({ message: "Meeting not found or expired" });
        }

        // Check if room is full
        if (room.participants.length >= room.maxParticipants) {
            return res.status(400).json({ message: "Meeting is full" });
        }

        // Check if already in room
        if (room.participants.includes(userId)) {
            const updatedRoom = await Room.findById(room._id)
                .populate('creator', 'fullName profilePic')
                .populate('participants', 'fullName profilePic')
                .populate('waitingRoom', 'fullName profilePic');
            return res.status(200).json({
                message: "Already in meeting",
                room: updatedRoom,
            });
        }

        // Verify password if required
        if (room.password) {
            if (!password) {
                return res.status(401).json({ 
                    message: "Password required",
                    requiresPassword: true 
                });
            }
            const isPasswordValid = await bcrypt.compare(password, room.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Incorrect password" });
            }
        }

        // If waiting room is enabled and user is not the creator
        if (room.waitingRoomEnabled && room.creator.toString() !== userId.toString()) {
            // Add to waiting room
            if (!room.waitingRoom.includes(userId)) {
                room.waitingRoom.push(userId);
                await room.save();
            }

            const updatedRoom = await Room.findById(room._id)
                .populate('creator', 'fullName profilePic')
                .populate('participants', 'fullName profilePic')
                .populate('waitingRoom', 'fullName profilePic');

            return res.status(200).json({
                message: "Added to waiting room",
                room: updatedRoom,
                inWaitingRoom: true,
            });
        }

        // Add user to participants
        room.participants.push(userId);
        await room.save();

        const updatedRoom = await Room.findById(room._id)
            .populate('creator', 'fullName profilePic')
            .populate('participants', 'fullName profilePic')
            .populate('waitingRoom', 'fullName profilePic');

        res.status(200).json({
            message: "Joined meeting successfully",
            room: updatedRoom,
        });
    } catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Admit user from waiting room (creator only)
export async function admitFromWaitingRoom(req, res) {
    try {
        const { roomId } = req.params;
        const { userId } = req.body;
        const requesterId = req.user._id;

        const room = await Room.findOne({ 
            $or: [{ roomId }, { roomCode: roomId.toUpperCase() }]
        });

        if (!room) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        // Only creator can admit users
        if (room.creator.toString() !== requesterId.toString()) {
            return res.status(403).json({ message: "Only meeting host can admit participants" });
        }

        // Remove from waiting room and add to participants
        room.waitingRoom = room.waitingRoom.filter(id => id.toString() !== userId);
        if (!room.participants.includes(userId)) {
            room.participants.push(userId);
        }
        await room.save();

        const updatedRoom = await Room.findById(room._id)
            .populate('creator', 'fullName profilePic')
            .populate('participants', 'fullName profilePic')
            .populate('waitingRoom', 'fullName profilePic');

        res.status(200).json({
            message: "User admitted to meeting",
            room: updatedRoom,
        });
    } catch (error) {
        console.error("Error admitting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Leave a room
export async function leaveRoom(req, res) {
    try {
        const { roomId } = req.params;
        const userId = req.user._id;

        const room = await Room.findOne({ 
            $or: [{ roomId }, { roomCode: roomId.toUpperCase() }]
        });

        if (!room) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        // Remove user from participants and waiting room
        room.participants = room.participants.filter(
            (participant) => participant.toString() !== userId.toString()
        );
        room.waitingRoom = room.waitingRoom.filter(
            (participant) => participant.toString() !== userId.toString()
        );

        // If creator leaves and room is empty, deactivate room
        if (room.creator.toString() === userId.toString() && room.participants.length === 0) {
            room.isActive = false;
        }

        await room.save();

        res.status(200).json({ message: "Left meeting successfully" });
    } catch (error) {
        console.error("Error leaving room:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Delete/Close a room (only creator)
export async function deleteRoom(req, res) {
    try {
        const { roomId } = req.params;
        const userId = req.user._id;

        const room = await Room.findOne({ 
            $or: [{ roomId }, { roomCode: roomId.toUpperCase() }]
        });

        if (!room) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        // Only creator can delete room
        if (room.creator.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only meeting host can end the meeting" });
        }

        room.isActive = false;
        await room.save();

        res.status(200).json({ message: "Meeting ended successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get user's created rooms
export async function getMyRooms(req, res) {
    try {
        const userId = req.user._id;

        const rooms = await Room.find({
            creator: userId,
            isActive: true,
        })
            .sort({ createdAt: -1 })
            .populate('creator', 'fullName profilePic')
            .populate('participants', 'fullName profilePic');

        res.status(200).json(rooms);
    } catch (error) {
        console.error("Error fetching user rooms:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Generate direct call link (doesn't require friendship)
export async function createDirectCallLink(req, res) {
    try {
        const { name, description, password } = req.body;
        const creator = req.user._id;

        // Generate unique call ID and room code
        const callId = nanoid(12);
        let roomCode = generateRoomCode();
        
        let existingRoom = await Room.findOne({ roomCode });
        while (existingRoom) {
            roomCode = generateRoomCode();
            existingRoom = await Room.findOne({ roomCode });
        }

        // Hash password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const room = await Room.create({
            name: name || `${req.user.fullName}'s Meeting`,
            description: description || "Direct call meeting",
            roomId: callId,
            roomCode,
            creator,
            password: hashedPassword,
            isPublic: false, // Private link
            maxParticipants: 100,
            participants: [creator],
            tags: ['direct-call'],
            meetingType: 'instant',
        });

        const populatedRoom = await Room.findById(room._id)
            .populate('creator', 'fullName profilePic');

        res.status(201).json({
            message: "Direct call link created",
            room: populatedRoom,
            inviteUrl: `${req.protocol}://${req.get('host')}/join/${roomCode}`,
        });
    } catch (error) {
        console.error("Error creating direct call link:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Join by room code
export async function joinByRoomCode(req, res) {
    try {
        const { roomCode } = req.params;
        const { password } = req.body;
        const userId = req.user._id;

        const room = await Room.findOne({ 
            roomCode: roomCode.toUpperCase(),
            isActive: true 
        });

        if (!room) {
            return res.status(404).json({ message: "Invalid meeting code" });
        }

        // Check password if required
        if (room.password) {
            if (!password) {
                return res.status(401).json({ 
                    message: "Password required",
                    requiresPassword: true,
                    roomId: room.roomId,
                });
            }
            const isPasswordValid = await bcrypt.compare(password, room.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Incorrect password" });
            }
        }

        // Return room info for joining
        const roomData = room.toObject();
        roomData.hasPassword = !!roomData.password;
        delete roomData.password;

        res.status(200).json({
            message: "Meeting found",
            room: roomData,
        });
    } catch (error) {
        console.error("Error joining by room code:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
