const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Group = require("../models/GroupModel");

//Create new group => /api/v1/createGroup
exports.createGroup = catchAsyncErrors(async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    const groupAdmin = req.body.user.username;
    const userId = req.body.user._id;
    const groupN = await Group.findOne({ groupName: groupName });
    if (!groupN) {
      const group = await Group.create({
        groupName: groupName,
        groupAdmin: groupAdmin,
        groupSenders: false,
      });
      group.users.push(userId);
      await group.save();
      res.json({ groupId: group._id, exist: false });
    } else {
      console.log("this group Name exist");
      res.json({ exist: true });
    }
  } catch (error) {
    console.error("Error creating group:", error);
    next(error); // Pass the error to the error handling middleware
  }
  ``;
});

//Get All groups that this user have=> /api/v1/UserGroupList
exports.getUserGroups = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const groups = await Group.find({ users: userId });
    //const groups = await Group.find({});
    if (!groups) {
      return next(new ErrorHandler("No groups", 404));
    }
    //console.log(groups)
    res.json(groups);
  } catch (error) {
    console.error("Error get user  Groups :", error);
    next(error); // Pass the error to the error handling middleware
  }
});

//delete group from db
exports.deleteGroup = catchAsyncErrors(async (req, res, next) => {
  try {
    const groupId = req.body.groupId;
    const group = await Group.findByIdAndDelete(groupId);
    if (group) {
      console.log("group deleted successfuly");
    } else {
      console.log("group not found");
    }
  } catch (error) {
    console.log("error delete group:".error);
    next(error);
  }
});

//save the latest message in group in db => api/v1/setLatestMessage
exports.setLatestMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const groupId = req.body.groupId;
    const latestMessage = req.body.latestMessage.message;
    const sendingTime = req.body.latestMessage.timeSent;
    console.log(`latestMessage:${latestMessage}`);
    const group = await Group.findByIdAndUpdate(groupId, {
      $set: { latestMessage: latestMessage, latestMessageTime: sendingTime },
    });
    if (!group) {
      console.log("group not found");
    }
  } catch (error) {
    console.log("error set latest message:".error);
    next(error);
  }
});

/*
exports.getGroupMessages=catchAsyncErrors(async(req,res,next)=>{

  try{
    const groupId=req.body.groupId;
    const group=await Group.findByIdAndUpdate(groupId, $set{ })
    if(group){
      console.log('group updated successfuly')
      

    }else{
      console.log('group not found')

    }
    
  }catch(error){
    console.log('error get roup:'.error)
    next(error)

  }
})
*/

//Add  a user to a specific group=> /api/v1/addUserToGroup
exports.addUserToGroup = catchAsyncErrors(async (req, res, next) => {});

// get all groups to search=> /api/v1/getAllGroups
exports.getAllGroups = catchAsyncErrors(async (req, res, next) => {
  try {
    const groups = await Group.find(); // Assuming the "users" collection has a "username" field
    res.json(groups);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

//add users to group after follow=> /api/v1/UpdateGroup
exports.UpdateGroup = catchAsyncErrors(async (req, res, next) => {
  const { userId, groupId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      console.log(groupId);
      console.log(userId);
      return res.status(404).send("Group not found");
    }

    group.users.push(userId);
    await group.save();

    res.status(200).send("User added to the array successfully");
  } catch (error) {
    console.error("Error updating user array:", error);
    res.status(500).send("Error updating user array");
  }
});

//remove user from group(unfollow)=>/api/v1/RemoveUserFromGroup
exports.RemoveUserFromGroup = catchAsyncErrors(async (req, res, next) => {
  const { userId, groupId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      console.log(groupId);
      console.log(userId);
      return res.status(404).send("Group not found");
    }

    group.users.remove(userId);
    await group.save();

    res.status(200).send("User removed from array successfully");
  } catch (error) {
    console.error("Error updating user array:", error);
    res.status(500).send("Error updating user array");
  }
});

//change group name => api/v1/changeGgoupName
exports.ChangeGgoupName = catchAsyncErrors(async (req, res, next) => {
  const newGroupName = req.body.groupName;
  const groupId = req.body.groupId;

  try {
    const groupN = await Group.findOne({ groupName: newGroupName });
    if (!groupN) {
      const group = await Group.findByIdAndUpdate(
        groupId,
        { groupName: newGroupName },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      res.json({ exist: false });
    } else {
      console.log("this group Name exist");
      res.json({ exist: true });
    }
  } catch (error) {
    console.error("Error updating group name:", error);
    res.status(500).send("Error updating group name");
  }
});

//delete user from Group users array => api/v1//UnfollowGroup
exports.UnfollowGroup = catchAsyncErrors(async (req, res, next) => {
  const groupId = req.body.groupId;
  const userId = req.body.userId;
  try {
    Group.findOneAndUpdate(
      { _id: groupId }, // Query condition to find the group by its ID
      { $pull: { users: userId } }, // Use $pull operator to remove the user from the users array
      { new: true } // Option to return the updated document
    ).then((updatedGroup) => {
      if (!updatedGroup) {
        // Handle case where group with the given ID is not found
        console.log("Group not found");
        return;
      }
      console.log("User removed successfully");
    });
  } catch (error) {
    console.error("Error unfollow group:", error);
    res.status(500).send("Error unfollow group");
  }
});

// get all groups=> /api/v1/getGroups
exports.getGroups = catchAsyncErrors(async (req, res, next) => {
  const groups = await Group.find();

  res.status(200).json({
    success: true,
    groups,
  });
});

//get group by Id
exports.getGroupByID = catchAsyncErrors(async (req, res, next) => {
  try {
    const groupId = req.body.groupId;
    const group = await Group.findById(groupId); // Replace 'Group' with your actual mongoose model name

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get the group users from the group db
exports.getGroupUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    const groupId = req.body.groupId;
    const group = await Group.findById(groupId).populate("users", "username");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const users = group.users || []; // Ensure a default value even if 'users' is undefined
    res.json(users);
  } catch (error) {
    console.error("Error fetching group users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//set the GroupSender (all the group members can send) false/true
exports.setGroupSender = catchAsyncErrors(async (req, res, next) => {
  try {
    const groupId = req.body.groupId;
    const groupSenders = req.body.groupSenders;
    console.log('here');
    const group = await Group.findByIdAndUpdate(groupId, {
      $set: { groupSenders: groupSenders },
    });
    console.log('groupSenders:'+group.groupSenders);
    if (!group) {
      console.log("group not found");
    }
  } catch (error) {
    console.log("error set groupSender:".error);
  }
});

//get the GroupSender (all the group members can send) false/true
exports.getGroupSenders = catchAsyncErrors(async (req, res, next) => {
  const groupId = req.body.groupId;
  const group = await Group.findById(groupId);
  res.json(group.groupSenders);
});

//add user by userId to muteOnUsers in group
exports.setMuteGroup = catchAsyncErrors(async (req, res, next) => {
  const { userId, groupId, muteGroup } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).send("Group not found");
    }

    if (muteGroup===true) {
      if(group.muteOnUsers.includes(userId)) {
        console.log('mute fail because user is muted before ');
      }else{
      group.muteOnUsers.push(userId);
      await group.save();
      console.log('mute'+muteGroup)
      }
    } else {
      group.muteOnUsers.pull(userId);
      await group.save();
      console.log('not mute'+ muteGroup)
    }

    res.status(200).send("User added to the array successfully");
  } catch (error) {
    console.error("Error updating muteOnUsers array:", error);
    res.status(500).send("Error updating muteOnUsers array");
  }
});

//check if user exist in the muteOnUsers  Array of a specific Group
exports.checkUserExistInMute = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId, groupId } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isUserMuted = group.muteOnUsers.includes(userId);
    console.log('isUserIncludeInMute :'+isUserMuted+ " User ID:" +userId );
    res.json( isUserMuted );
  } catch (error) {
    console.error('Error checking user in mute list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});