import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    roomCode: {
        type: String,
        required: true,
        unique: true,
        index: true,
        uppercase: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        default: null, // Password protected rooms
    },
    maxParticipants: {
        type: Number,
        default: 100,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    waitingRoom: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    tags: [{
        type: String,
    }],
    // Zoom-like features
    waitingRoomEnabled: {
        type: Boolean,
        default: false,
    },
    recordingEnabled: {
        type: Boolean,
        default: false,
    },
    allowScreenSharing: {
        type: Boolean,
        default: true,
    },
    muteParticipantsOnEntry: {
        type: Boolean,
        default: false,
    },
    allowParticipantsToUnmute: {
        type: Boolean,
        default: true,
    },
    // Meeting scheduling
    scheduledTime: {
        type: Date,
        default: null,
    },
    duration: {
        type: Number, // in minutes
        default: 60,
    },
    isScheduled: {
        type: Boolean,
        default: false,
    },
    // Meeting type
    meetingType: {
        type: String,
        enum: ['instant', 'scheduled', 'recurring'],
        default: 'instant',
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
    // Recording metadata
    recordings: [{
        startTime: Date,
        endTime: Date,
        duration: Number,
        fileUrl: String,
    }],
}, { timestamps: true });

// Index for finding active public rooms
roomSchema.index({ isPublic: 1, isActive: 1, createdAt: -1 });

// Index for room code lookup
roomSchema.index({ roomCode: 1 });

// Automatically delete rooms after expiry
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Room = mongoose.model("Room", roomSchema);

export default Room;
