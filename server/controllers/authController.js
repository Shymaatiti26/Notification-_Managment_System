const User = require('../models/User')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');


//Register a user => api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
   
    const { username, email,phone, password } = req.body;
    //console.log("hi");
    console.log(req.body);
    const user = await User.create({
        username,
        email,
        phone,
        password,     
    })
    sendToken(user, 200, res)
})

//Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //Check if email and password is enterd by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password !'))
    }

    //Finding user in database
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }
    //Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res)

})


// Get cuurently looged in user details => /api/v1/me
exports.getUserProfile =  catchAsyncErrors(async (req, res, next) => {
    const userId = req.query.userId;
    const user =  await User.findById(userId);

    res.status(200).json({
        success:true,
        user
    })
    console.log("userid",userId);
    console.log("user is:",user);

})

//Update / change password => /api/v1/password/update
exports.updatePassword =  catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    // check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect',400))
    }


    user.password = req.body.password;
    await user.save();

    sendToken(user,200,res)

})

//Update user profile =>   /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = { 
        name: req.body.name,
        email: req.body.email,
        phone:req.body.phone
    }


    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })

})
// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})

// Admin Routes

// get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
})


// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })

})

//Update user profile =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = { 
        name: req.body.name,
        email: req.body.email,
        role:req.body.role
    }


    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })

})

//Delete user  =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
   
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    //Remove avatar frOm cloudinary - TODO

    await user.deleteOne();

    res.status(200).json({
        success:true
    })

})

//Create group => /api/v1/createGroup
exports.createGroup=catchAsyncErrors(async(req,res,next)=>{
    console.log("User created:");

})

