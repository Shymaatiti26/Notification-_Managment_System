const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Group = require('../models/GroupModel');

//Create new group => /api/v1/createGroup
exports.createGroup=catchAsyncErrors(async(req,res,next)=>{
    try {
        const groupName = req.body.groupName;
        const group = await Group.create({ groupName: groupName});
        res.json({groupId: group._id});
      } catch (error) {
        console.error('Error creating group:', error);
        next(error); // Pass the error to the error handling middleware
      }

})

//Get All groups that this user have=> /api/v1/UserGroupList
exports.getUserGroups=catchAsyncErrors(async(req,res,next) =>{  
  try{
  //const userId = req.user.id
  //const groups = await Group.find({ users: { $in: [ObjectId(userId)] } }).toArray();
  const groups = await Group.find({  });
  if(!groups){
    return next(new ErrorHandler("No groups" ,404))
   }
   console.log(groups)
   res.json(groups)
  }catch (error) {
    console.error('Error get user  Groups :', error);
    next(error); // Pass the error to the error handling middleware
  }


})


//Add  a user to a specific group=> /api/v1/addUserToGroup
exports.addUserToGroup=catchAsyncErrors(async (req,res,next) =>{
  

})
// get all groups to search=> /api/v1/getAllGroups
exports.getAllGroups= catchAsyncErrors(async(req,res,next)=>{

  try {
    const groups = await Group.find(); // Assuming the "users" collection has a "username" field
    res.json(groups);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
})
//add users to group after follow=> /api/v1/UpdateGroup
exports.UpdateGroup=catchAsyncErrors(async(req,res,next)=>{

  const { userId, groupId } = req.body;
  try {
    const group = await Group.findById(groupId);
        if (!group) {
            console.log(groupId);
            console.log(userId);
            return res.status(404).send('Group not found');
        }

        group.users.push(userId);
        await group.save();

        res.status(200).send('User added to the array successfully');
  } catch (error) {
    console.error('Error updating user array:', error);
    res.status(500).send('Error updating user array');
  }
})
//remove user from group(unfollow)=>/api/v1/RemoveUserFromGroup
exports.RemoveUserFromGroup=catchAsyncErrors(async(req,res,next)=>{

  const { userId, groupId } = req.body;
  try {
    const group = await Group.findById(groupId);
        if (!group) {
            console.log(groupId);
            console.log(userId);
            return res.status(404).send('Group not found');
        }

        group.users.remove(userId);
        await group.save();

        res.status(200).send('User removed from array successfully');
  } catch (error) {
    console.error('Error updating user array:', error);
    res.status(500).send('Error updating user array');
  }
})


