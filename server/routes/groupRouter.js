const express = require('express');
const router = express.Router(); 
const { createGroup,
        getUserGroups,
        getAllGroups ,
        UpdateGroup,
        RemoveUserFromGroup} = require('../controllers/groupController');

router.route('/createGroup').post(createGroup);
router.route('/UserGroupList').post(getUserGroups);
router.route('/getAllGroups').get(getAllGroups);
router.route('/UpdateGroup').put(UpdateGroup);
router.route('/RemoveUserFromGroup').put(RemoveUserFromGroup);
module.exports= router;