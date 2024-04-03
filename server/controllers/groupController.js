const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Group = require('../models/GroupModel');

//Create new group => /api/v1/createGroup
exports.createGroup=catchAsyncErrors(async(req,res,next)=>{
    try {
        const groupName = req.body.groupName;
        const groupN= await Group.findOne({groupName:groupName});
        if(!groupN){
        const group = await Group.create({ groupName: groupName});
        res.json({groupId: group._id ,exist:false});
        }else{
          console.log("this group Name exist");
          res.json({exist:true});
        }
      } catch (error) {
        console.error('Error creating group:', error);
        next(error); // Pass the error to the error handling middleware
      }
``
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
   //console.log(groups)
   res.json(groups)
  }catch (error) {
    console.error('Error get user  Groups :', error);
    next(error); // Pass the error to the error handling middleware
  }


})

//delete group from db 
exports.deleteGroup=catchAsyncErrors(async(req,res,next)=>{

  try{
    const groupId=req.body.groupId;
    const group=await Group.findByIdAndDelete(groupId)
    if(group){
      console.log('group deleted successfuly')
      

    }else{
      console.log('group not found')

    }
    
  }catch(error){
    console.log('error delete group:'.error)
    next(error)

  }
})

//save the latest message in group in db => api/v1/setLatestMessage
exports.setLatestMessage=catchAsyncErrors(async(req,res,next)=>{
  try {
    const groupId = req.body.groupId
    const latestMessage= req.body.latestMessage
    console.log(`latestMessage:${latestMessage}`)
    const group = await Group.findByIdAndUpdate(groupId, { $set: { latestMessage: latestMessage } })
    if(!group){
      console.log('group not found')

    }

    }catch(error){
        console.log('error set latest message:'.error)
        next(error)
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
exports.addUserToGroup=catchAsyncErrors(async (req,res,next) =>{
  

})


