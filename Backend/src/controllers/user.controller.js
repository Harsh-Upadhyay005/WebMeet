import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        // Logic to get recommended users

        const recommendedUsers = await User.find({
            $and:[
            {_id: { $ne: currentUserId }}, // exclude current user
            {_id: { $nin: currentUser.friends }}, // exclude friends
            {isOnboarded: true} // only onboarded users
            ],
        }); 

        res.status(200).json( recommendedUsers );
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({message: "Internal Server Error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('friends')
         .populate("friends","fullName profilePic nativeLanguage learningLanguage");
        
         res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const {id: recipientId} = req.params;

        // prevent sending request to self
        if(myId === recipientId) {
            return res.status(400).json({ message: "Cannot send friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({ message: "User not found" });
        }
        // check if already friends
        if(recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "User is already your friend" });
        }
        // check if request already sent
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });
        if (existingRequest) {
            return res
            .status(400)
            .json({ message: "Friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });
        res.status(200).json({ message: "Friend request sent", friendRequest });


    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({message: "Internal Server Error" });
    }
        
}

export async function acceptFriendRequest(req, res) {
    try {
        const {id: requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }
        friendsRequest.status = "accepted";
        await friendsRequest.save();

        // update both users' friends list

        // $addToSet: adds value to array only if it doesn't already exist
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });
        res.status(200).json({ message: "Friend request accepted" });
        
    } catch (error) {
        console.log("Error accepting friend request:", error.message);
        res.status(500).json({message: "Internal Server Error" });
        
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json({incomingRequests, acceptedRequests});
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({message: "Internal Server Error" });
    }
}

export async function getOutgoingFriendReqquests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json({ outgoingRequests });
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({message: "Internal Server Error" });
    }
}