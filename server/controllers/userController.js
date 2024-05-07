const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/User");
//const User1= require("../models/FollowedUsers");

// get all users to search=> /api/v1/getAllUsers
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find(); // Assuming the "users" collection has a "username" field
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

// create user Followers array -> api/v1/followUser
exports.followUser = catchAsyncErrors(async (req, res, next) => {
  const { adminId, userId } = req.body;
  try {
    const admin = await User.findById(adminId);
    if (!admin) {
      console.log(adminId);
      console.log(userId);
      return res.status(404).send("Admin not found");
    }

    // Fetch the username associated with the userId
    const followedUser = await User.findById(userId);
    if (!followedUser) {
      return res.status(404).send("User not found");
    }
    const { username } = followedUser;

    // Add the followed user (userId and username) to the followedUsers array
    admin.followedUsers.push({ userId, username });
    await admin.save();

    res.status(200).send("Followed user added to the array successfully");
  } catch (error) {
    console.error("Error updating user array:", error);
    res.status(500).send("Error updating user array");
  }
});

  
  // Endpoint: api/v1/RemoveUserFromUser1
  exports.removeUserFromUser1 = catchAsyncErrors(async (req, res, next) => {
    const { adminId, userId, username } = req.body;
    try {
        const admin = await User.findById(adminId);
        if (!admin) {
            console.log(adminId);
            console.log(userId);
            return res.status(404).send("User not found");
        }

        // Remove the user from the followedUsers array
console.log(userId)
        admin.followedUsers = admin.followedUsers.filter(user => user.userId != userId);
        console.log(admin.followedUsers);
        await admin.save();
       
        console.log("adminId");
        res.status(200).send("User removed from array successfully");
    } catch (error) {
        console.error("Error updating user array:", error);
        res.status(500).send("Error updating user array");
    }
});



 //delete user from followedusers array => api/v1//UnfollowUser
 exports.UnfollowUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.body.userId;
  const adminId = req.body.adminId;
  try {
    const admin = await User.findById(adminId);
    if (!admin) {
        console.log(adminId);
        console.log(userId);
        return res.status(404).send("User not found");
    }

    // Remove the user from the followedUsers array
console.log(userId)
    admin.followedUsers = admin.followedUsers.filter(user => user.userId != userId);
    console.log(admin.followedUsers);
    await admin.save();
  
    res.status(200).send("User removed from array successfully");
  } catch (error) {
    console.error("Error unfollow user:", error);
    res.status(500).send("Error unfollow user");
  }
});


exports.followedUsersList = catchAsyncErrors(async (req, res, next) => {
  try {
    const adminId = req.query.adminId;
    const admin = await User.findById(adminId);
    if (!admin)
    {
      return next(new ErrorHandler("No admin found", 404));
    }

   // console.loge('followedUsers:'+admin.followedUsers)
    res.json(admin.followedUsers);

  } catch (error) {
    console.error("Error getting followed users:", error);
    next(error);
  }
});


///api/v1/setMuteUser
exports.setMuteUser = catchAsyncErrors(async (req, res, next) => {
  const { adminId, userId, muteUser } = req.body;
  try {
    // Find the admin user
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).send("Admin user not found");
    }

    // Find the followed user within the admin's followedUsers array
    const followedUser = admin.followedUsers.find(
      (user) => user.userId.toString() === userId
    );

    if (!followedUser) {
      return res.status(404).send("Followed user not found");
    }

    // Update the muteOnUsers array for the followed user
    if (muteUser === true) {
      if (followedUser.muteOnUsers.includes(adminId)) {
        console.log('User is already muted');
      } else {
        followedUser.muteOnUsers.push(adminId);
        await admin.save();
        console.log('User muted successfully');
      }
    } else {
      followedUser.muteOnUsers.pull(adminId);
      await admin.save();
      console.log('User unmuted successfully');
    }

    res.status(200).send("User mute status updated successfully");
  } catch (error) {
    console.error("Error updating muteOnUsers array:", error);
    res.status(500).send("Error updating muteOnUsers array");
  }
});

//save the lastest message in DB => api/v1/setLatestUserMessage
exports.setLatestUserMessage = async (req, res, next) => {
  try {
    const { adminId, userId, latestMessage, timeSent } = req.body;

    // Find the user by adminId
    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the followedUser object in the user's followedUsers array
    const followedUser = admin.followedUsers.find(user => user.userId.toString() === userId);

    if (!followedUser) {
      return res.status(404).json({ success: false, message: 'Followed user not found' });
    }

    // Update the latestMessage and latestMessageTime fields
    followedUser.latestMessage = latestMessage;
    followedUser.latestMessageTime = timeSent;

    // Update the document directly in the database
    await User.findOneAndUpdate(
      { _id: adminId, "followedUsers._id": followedUser._id },
      {
        $set: {
          "followedUsers.$.latestMessage": latestMessage,
          "followedUsers.$.latestMessageTime": timeSent
        }
      }
    );

    res.status(200).json({ success: true, message: 'Latest message updated successfully' });
  } catch (error) {
    console.log('Error setting latest message:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.checkUserExistInMute1 = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId, adminId } = req.body;
    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: 'admin not found' });
    }
    const followedUser = admin.followedUsers.find(user => user.userId.toString() === userId);
    if (!followedUser) {
      return res.status(404).json({ success: false, message: 'Followed user not found' });
    }

    const isUserMuted = followedUser.muteOnUsers.includes(adminId);
    console.log('isUserIncludeInMute :'+isUserMuted);
    res.json( isUserMuted );
  } catch (error) {
    console.error('Error checking user in mute list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

exports.followedUsersList2 = catchAsyncErrors(async (req, res, next) => {
  try {
    const adminId = req.body.adminId;
    console.log("Admin Id 2: "+adminId);
    const admin = await User.findById(adminId);
    if (!admin)
    {
      return next(new ErrorHandler("No admin found2", 404));
    }

   // console.loge('followedUsers:'+admin.followedUsers)
   const  followdUsers = admin.followedUsers.map(user =>user.userId);
   //console.loge('followedUsers2:'+followdUsers)
    res.json(followdUsers);

  } catch (error) {
    console.error("Error getting followed users:", error);
  }
});

//save notification in user db
// exports.saveNotificationforUser = catchAsyncErrors(async (req, res, next) => {
//   try {
//     // Extract notification data from request body
//     const { notification, userId, notificationsRecived } = req.body;

//     // Validate notification data to ensure it's properly formed

//     // Create notification object to be saved in user's notifications array
//     const notif = {
//       sender: notification.adminId,
//       group: notification.userId,
//       message: notification.message,
//       timeSent: notification.timeSent,
//       sendLater: notification.sendLater,
//       groupName: notification.username // Assuming notification.group exists
//     };

//     // Find the user by userId
//     const user = await User.findById(userId);

//     // If user is not found, handle the error
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Push the notification to user's notifications array
//     user.notifications.push(notif);

//     // Ensure notificationsRecived is an array before pushing to it
   
//       user.notifications.notificationsRecived.push(notificationsRecived);
    

//     // Save the updated user document
//     await user.save();

//     // Send a success response
//     res.status(200).json({ success: true, message: 'Notification saved successfully' });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     console.error('Error saving notification:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

exports.saveNotificationforUser = catchAsyncErrors(async (req, res, next) => {
  try {
    // Extract notification data from request body
    const { notification, userId, notificationsRecived } = req.body;

    const senderDetails = await User.findById(notification.adminId);
    if (!senderDetails) {
      throw new Error("Sender details not found");
    }
    // Validate notification data to ensure it's properly formed
    console.log("btehaaa",senderDetails)
    const senderObject = {
      userId: senderDetails._id,
      username: senderDetails.username, // Assuming username is a field in the User model
      email: senderDetails.email, // Assuming email is a field in the User model
      // Add other required sender details as needed
    };
    // Create notification object to be saved in user's notifications array
    const notif = {
      sender: notification.adminId,
      senderDetails: senderObject,
      senderName: notification.adminName,
      group: notification.userId,
      message: notification.message,
      timeSent: notification.timeSent,
      sendLater: notification.sendLater,
      groupName: notification.username, // Assuming notification.group exists
      notificationsRecived // Assign notificationsRecived to the notification object
    };

    // Find the user by userId
    const user = await User.findById(userId);
    //const senderDetails = await User.findById(notif.sender);

    // If user is not found, handle the error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log("userNotiAdham",notif);
    // Push the notification to user's notifications array
    notif.senderDetails=senderDetails;
    user.notifications.push(notif);

    // Save the updated user document
    await user.save();

    // Send a success response
    res.status(200).json({ success: true, message: 'Notification saved successfully' });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error saving notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


exports.getUserByID = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId); // Replace 'Group' with your actual mongoose model name
    //console.log(group);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});