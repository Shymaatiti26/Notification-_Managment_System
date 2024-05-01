const express = require('express');
const router = express.Router(); 
const { createGroup, getUserGroups, deleteGroup, setLatestMessage, getAllGroups, UpdateGroup, RemoveUserFromGroup,ChangeGgoupName
    ,UnfollowGroup ,getGroups,getGroupByID,getGroupUsers,setGroupSender,getGroupSenders,setMuteGroup,checkUserExistInMute,addAdmins ,
    deleteAdmin,getUserfollowedGroups} = require('../controllers/groupController');

router.route('/createGroup').post(createGroup);
router.route('/UserGroupList').get(getUserGroups);
router.route('/deleteGroup').post(deleteGroup);
router.route('/setLatestMessage').post(setLatestMessage);
router.route('/getAllGroups').get(getAllGroups);
router.route('/UpdateGroup').put(UpdateGroup);
router.route('/RemoveUserFromGroup').put(RemoveUserFromGroup);
router.route('/changeGgoupName').post(ChangeGgoupName);
router.route('/UnfollowGroup').post(UnfollowGroup);
router.route('/getGroups').get(getGroups);
router.route('/getGroupByID').post(getGroupByID);
router.route('/getGroupUsers').post(getGroupUsers);
router.route('/setGroupSender').post(setGroupSender);
router.route('/getGroupSenders').post(getGroupSenders);
router.route('/setMuteGroup').post(setMuteGroup);
router.route('/checkUserExistInMute').post(checkUserExistInMute);
router.route('/addAdmins').post(addAdmins);
router.route('/deleteAdmin').post(deleteAdmin);
router.route('/getUserfollowedGroups').post(getUserfollowedGroups);


module.exports= router;