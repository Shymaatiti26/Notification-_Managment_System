const express = require('express');
const { getAllUsers,followUser,removeUserFromUser1,UnfollowUser,followedUsersList,setLatestUserMessage ,setMuteUser} = require('../controllers/userController');
const {sendUserMessages,getUserMessage,setSenLaterToFalse}=require('../controllers/userMessageController')
const router = express.Router(); 

router.route('/getAllUsers').get(getAllUsers);
router.route('/followedUsersList').get(followedUsersList);
router.route('/followUser').post(followUser);
router.route('/UnfollowUser').put(UnfollowUser);
router.route('/removeUserFromUser1').put(removeUserFromUser1);
router.route('/setLatestUserMessage').post(setLatestUserMessage);
router.route('/setMuteUser').post(setMuteUser);
//from userMessageController
router.route('/sendUserMessages').post(sendUserMessages);
router.route('/getUserMessage').post(getUserMessage);
router.route('/setSenLaterToFalse').post(setSenLaterToFalse);
module.exports= router;