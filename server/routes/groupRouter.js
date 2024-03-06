const express = require('express');
const router = express.Router(); 
const { createGroup, getUserGroups, deleteGroup, setLatestMessage  } = require('../controllers/groupController');

router.route('/createGroup').post(createGroup);
router.route('/UserGroupList').get(getUserGroups);
router.route('/deleteGroup').post(deleteGroup);
router.route('/setLatestMessage').post(setLatestMessage);

module.exports= router;