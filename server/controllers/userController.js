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

  // exports.followUser = catchAsyncErrors(async (req, res, next) => {
  //   const { adminId, userId } = req.body;
  // try {
  //   const admin = await User.findById(adminId);
  //   if (!admin) {
  //     console.log(adminId);
  //     console.log(userId);
  //     return res.status(404).send("admin not found");
  //   }

  //   admin.followedUsers.push(userId);
  //   await admin.save();

  //   res.status(200).send("follow User added to the array successfully");
  // } catch (error) {
  //   console.error("Error updating user array:", error);
  //   res.status(500).send("Error updating user array");
  // }
  // });

  
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
    if(admin.followedUsers.length === 0) {
      return next(new ErrorHandler("No followedUsers found", 404));
    }
    res.json(admin.followedUsers);
  } catch (error) {
    console.error("Error getting followed users:", error);
    next(error);
  }
});