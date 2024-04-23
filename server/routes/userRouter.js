const express = require('express');
const { getAllUsers,followUser,UpdateUser1,removeUserFromUser1 } = require('../controllers/userController');
const router = express.Router(); 

router.route('/getAllUsers').get(getAllUsers);
router.route('/followUser').post(followUser);
//router.route('/UpdateUser1').put(UpdateUser1);
router.route('/removeUserFromUser1').put(removeUserFromUser1);
module.exports= router;