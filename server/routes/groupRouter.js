const express = require('express');
const router = express.Router(); 
const { createGroup,getUserGroups } = require('../controllers/groupController');

router.route('/createGroup').post(createGroup);
router.route('/UserGroupList').post(getUserGroups);

module.exports= router;