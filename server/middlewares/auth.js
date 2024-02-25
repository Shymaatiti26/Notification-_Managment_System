const User = require('../models/User')
const jwt = require('jsonwebtoken')
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;
    localStorage.setItem('token',token);
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401))
    }

    const decoded = jwt.verify(token, "3dL1k49$!2DnQ@1mP5oTz7#s")
    req.user = await User.findById(decoded.id);
    next()

})

// Handling users roles 
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource,`
                , 403)
            )
        }
        next()
    }
}