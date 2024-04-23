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
      return res.status(404).send("admin not found");
    }

    admin.followedUsers.push(userId);
    await admin.save();

    res.status(200).send("follow User added to the array successfully");
  } catch (error) {
    console.error("Error updating user array:", error);
    res.status(500).send("Error updating user array");
  }
  });

  
  // Endpoint: api/v1/RemoveUserFromUser1
exports.removeUserFromUser1 = catchAsyncErrors(async (req, res, next) => {
    const { adminId, userId } = req.body;
    try {
      const admin = await User.findById(adminId);
      if (!admin) {
        console.log(adminId);
        console.log(userId);
        return res.status(404).send("user not found");
      }
  
      admin.followedUsers.remove(userId);
      await admin.save();
  
      res.status(200).send("User removed from array successfully");
    } catch (error) {
      console.error("Error updating user array:", error);
      res.status(500).send("Error updating user array");
    }
  
  //   const { adminId, userId } = req.body;
    
  //   // Find the user with adminId
  //   const adminUser = await User.findById(adminId);
  //   if (!adminUser) {
  //     return res.status(404).json({ success: false, message: 'Admin user not found' });
  //   }
    
  //   // Check if the user with userId exists in followedUsers
  //   if (!adminUser.followedUsers.includes(userId)) {
  //     return res.status(400).json({ success: false, message: 'User is not followed' });
  //   }
    
  //   // Remove the userId from followedUsers array
  //   adminUser.followedUsers = adminUser.followedUsers.filter(id => id !== userId);
  //   await adminUser.save();
    
  //   res.status(200).json({ success: true, message: 'User removed from followedUsers successfully', user: adminUser });
  // } catch (error) {
  //   console.error('Error removing user from followedUsers:', error);
  //   next(error);
  // }
});

// // Endpoint: api/v1/UpdateUser1
// exports.UpdateUser1 = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { adminId, userId } = req.body;
    
//     // Find the user with adminId
//     const adminUser = await User1.findById(adminId);
//     if (!adminUser) {
//       return res.status(404).json({ success: false, message: 'Admin user not found' });
//     }
    
//     // Check if the user with userId already exists in followedUsers
//     if (adminUser.followedUsers.includes(userId)) {
//       return res.status(400).json({ success: false, message: 'User is already followed' });
//     }
    
//     // Add the userId to followedUsers array
//     adminUser.followedUsers.push(userId);
//     await adminUser.save();
    
//     res.status(200).json({ success: true, message: 'User added to followedUsers successfully', user: adminUser });
//   } catch (error) {
//     console.error('Error adding user to followedUsers:', error);
//     next(error);
//   }
// });

