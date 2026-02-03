import Group from '../models/Group.js';
import User from '../models/User.js';

// Create a new group
export async function createGroup(req, res) {
    try {
        const { name, description, memberIds } = req.body;
        const adminId = req.user._id;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: "Group name is required" });
        }

        if (!memberIds || memberIds.length < 1) {
            return res.status(400).json({ message: "At least one member is required" });
        }

        // Verify all members are friends of the admin
        const admin = await User.findById(adminId);
        const validMembers = memberIds.filter(id => 
            admin.friends.some(friendId => friendId.toString() === id)
        );

        if (validMembers.length !== memberIds.length) {
            return res.status(400).json({ message: "All members must be your friends" });
        }

        // Generate a random avatar for the group
        const idx = Math.floor(Math.random() * 100) + 1;
        const groupAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const group = await Group.create({
            name: name.trim(),
            description: description?.trim() || "",
            avatar: groupAvatar,
            admin: adminId,
            members: [adminId, ...validMembers],
        });

        // Populate members for response
        await group.populate('members', 'fullName profilePic');
        await group.populate('admin', 'fullName profilePic');

        res.status(201).json({ 
            success: true, 
            message: "Group created successfully",
            group 
        });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get all groups for the current user
export async function getMyGroups(req, res) {
    try {
        const userId = req.user._id;

        const groups = await Group.find({
            members: userId
        })
        .populate('members', 'fullName profilePic')
        .populate('admin', 'fullName profilePic')
        .sort({ updatedAt: -1 });

        res.status(200).json(groups);
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get a specific group by ID
export async function getGroupById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(id)
            .populate('members', 'fullName profilePic nativeLanguage')
            .populate('admin', 'fullName profilePic');

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if user is a member
        const isMember = group.members.some(member => member._id.toString() === userId.toString());
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error("Error fetching group:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Update group details (admin only)
export async function updateGroup(req, res) {
    try {
        const { id } = req.params;
        const { name, description, avatar } = req.body;
        const userId = req.user._id;

        const group = await Group.findById(id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the admin can update the group" });
        }

        if (name) group.name = name.trim();
        if (description !== undefined) group.description = description.trim();
        if (avatar) group.avatar = avatar;

        await group.save();
        await group.populate('members', 'fullName profilePic');
        await group.populate('admin', 'fullName profilePic');

        res.status(200).json({ 
            success: true,
            message: "Group updated successfully",
            group 
        });
    } catch (error) {
        console.error("Error updating group:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Add members to group (admin only)
export async function addMembers(req, res) {
    try {
        const { id } = req.params;
        const { memberIds } = req.body;
        const userId = req.user._id;

        if (!memberIds || memberIds.length === 0) {
            return res.status(400).json({ message: "Member IDs are required" });
        }

        const group = await Group.findById(id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the admin can add members" });
        }

        // Verify all new members are friends of the admin
        const admin = await User.findById(userId);
        const validMembers = memberIds.filter(memberId => 
            admin.friends.some(friendId => friendId.toString() === memberId) &&
            !group.members.some(existingId => existingId.toString() === memberId)
        );

        if (validMembers.length === 0) {
            return res.status(400).json({ message: "No valid members to add" });
        }

        group.members.push(...validMembers);
        await group.save();
        await group.populate('members', 'fullName profilePic');
        await group.populate('admin', 'fullName profilePic');

        res.status(200).json({ 
            success: true,
            message: `${validMembers.length} member(s) added successfully`,
            group 
        });
    } catch (error) {
        console.error("Error adding members:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Remove a member from group (admin only, or member removing themselves)
export async function removeMember(req, res) {
    try {
        const { id, memberId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const isAdmin = group.admin.toString() === userId.toString();
        const isSelfRemoval = memberId === userId.toString();

        if (!isAdmin && !isSelfRemoval) {
            return res.status(403).json({ message: "Not authorized to remove members" });
        }

        // Prevent admin from being removed
        if (memberId === group.admin.toString()) {
            return res.status(400).json({ message: "Admin cannot be removed from the group" });
        }

        group.members = group.members.filter(
            member => member.toString() !== memberId
        );

        await group.save();
        await group.populate('members', 'fullName profilePic');
        await group.populate('admin', 'fullName profilePic');

        res.status(200).json({ 
            success: true,
            message: isSelfRemoval ? "You left the group" : "Member removed successfully",
            group 
        });
    } catch (error) {
        console.error("Error removing member:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Delete a group (admin only)
export async function deleteGroup(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the admin can delete the group" });
        }

        await Group.findByIdAndDelete(id);

        res.status(200).json({ 
            success: true,
            message: "Group deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
