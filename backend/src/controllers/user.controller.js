import User from '../models/user.model.js';
import FriendRequest from '../models/FriendRequest.js';

export async function getRecommendedUsers(req, res) {

    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude the current user
                { _id: { $nin: currentUser.friends } }, // Exclude friends
                {isOnboarded: true} // Only include users who have completed onboarding
            ]
        }).select("fullName profilePicture location nativeLanguage learningLanguage bio isOnboarded");


        res.status(200).json({ success: true, recommendedUsers });

}catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getFriends(req, res) {

    try {
        const user = await User.findById(req.user._id).select("friends")
    .populate("friends","fullName profilePicture location nativeLanguage learningLanguage bio");

        res.status(200).json(user.friends);

} catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
}
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user._id;
        const {id:recipientId} = req.params;

        if(myId.toString() === recipientId){
            return res.status(400).json({success: false, message: "You cannot send a friend request to yourself"});
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the recipient is already a friend
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ success: false, message: "You are already friends with this user" });
        }

        //check if the friend request has already been sent
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender:myId, recipient:recipientId},
                {sender:recipientId, recipient:myId}
            ]
        });

        if (existingRequest) {
            return res
            .status(400)
            .json({ success: false, message: "Friend request already sent" });
        }

        const friendRequest = new FriendRequest({
            sender: myId,
            recipient: recipientId
        });

        await friendRequest.save();

        return res.status(201).json({ success: true, message: "Friend request sent successfully" });


    }catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const {id: requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ success: false, message: "Friend request not found" });
        }

        //verify that the current user is the recipient of the friend request
        if (friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each other to friends list
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { friends: friendRequest.sender }
        });

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: req.user._id }
        });

        return res.status(200).json({
            success: true,
            message: "Friend request accepted successfully"
        });
    
    }catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        }).populate("sender", "fullName profilePicture location nativeLanguage learningLanguage bio");

        const acceptedRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted"
        }).populate("recipient", "fullName profilePicture location nativeLanguage learningLanguage bio");

        return res.status(200).json({
            success: true,
            incomingReqs: incomingRequests,
            acceptedReqs: acceptedRequests,
        });

    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending"
        }).populate("recipient", "fullName profilePicture location nativeLanguage learningLanguage bio");

        return res.status(200).json({ success: true, friendRequests: outgoingRequests });

    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function cancelFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });
        }

        // Only the sender can cancel the request
        if (friendRequest.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this friend request"
            });
        }

        // Only pending requests can be cancelled
        if (friendRequest.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending friend requests can be cancelled"
            });
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return res.status(200).json({
            success: true,
            message: "Friend request cancelled successfully"
        });

    } catch (error) {
        console.error("Error cancelling friend request:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}