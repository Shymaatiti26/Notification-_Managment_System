const express = require('express');
const router = express.Router(); 
const { createGroup, getUserGroups, deleteGroup, setLatestMessage, getAllGroups, UpdateGroup, RemoveUserFromGroup  } = require('../controllers/groupController');

router.route('/createGroup').post(createGroup);
router.route('/UserGroupList').get(getUserGroups);
router.route('/deleteGroup').post(deleteGroup);
router.route('/setLatestMessage').post(setLatestMessage);
router.route('/getAllGroups').get(getAllGroups);
router.route('/UpdateGroup').put(UpdateGroup);
router.route('/RemoveUserFromGroup').put(RemoveUserFromGroup);

module.exports= router;