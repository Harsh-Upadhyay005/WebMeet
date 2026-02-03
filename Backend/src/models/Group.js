import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        index: true,
    },
    description: {
        type: String,
        default: "",
        maxlength: 200,
    },
    avatar: {
        type: String,
        default: "",
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    streamChannelId: {
        type: String,
        unique: true,
        sparse: true,
    },
}, { timestamps: true });

// Index for finding groups by member
groupSchema.index({ members: 1 });

// Compound index for common queries
groupSchema.index({ members: 1, updatedAt: -1 });

// Pre-save hook to generate stream channel ID
groupSchema.pre("save", function(next) {
    if (!this.streamChannelId) {
        this.streamChannelId = `group-${this._id}`;
    }
    next();
});

// Ensure admin is always in members
groupSchema.pre("save", function(next) {
    if (!this.members.includes(this.admin)) {
        this.members.push(this.admin);
    }
    next();
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
