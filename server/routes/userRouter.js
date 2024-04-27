const express = require('express');
const { getAllUsers,followUser,removeUserFromUser1,UnfollowUser,followedUsersList } = require('../controllers/userController');
const router = express.Router(); 

router.route('/getAllUsers').get(getAllUsers);
router.route('/followedUsersList').get(followedUsersList);
router.route('/followUser').post(followUser);
router.route('/UnfollowUser').put(UnfollowUser);
router.route('/removeUserFromUser1').put(removeUserFromUser1);
module.exports= router;