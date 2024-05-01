const express = require('express');
const router = express.Router();
//const { isAuthenticatedUser , authorizeRoles} = require('../middlewares/auth');

const{
    registerUser,
    loginUser,
    logout,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    saveNotification,
    getUserNotifications,
    deleteNotification,
} = require('../controllers/authController');


router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').post(logout);

router.route('/me').get(getUserProfile);

router.route('/saveNotification').post(saveNotification);

router.route('/getUserNotifications').post(getUserNotifications);

router.route('/deleteNotification').post(deleteNotification);

router.route('/users').get(allUsers);

router.route('/me/update').put(updateProfile);
/*

router.route('/password/update').put(isAuthenticatedUser,updatePassword);



router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),allUsers)

router.route('/admin/user/:id')
.get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)
*/

module.exports= router;