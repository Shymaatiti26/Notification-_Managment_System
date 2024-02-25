const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone'],
        validate: [validator.isMobilePhone, 'Please enter valid phone number']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
})


//Encrypting password before save user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//Return JWT token 
userSchema.methods.getJwtToken = function () {
    console.log(process.env.JWT_SECRET);
    return jwt.sign({ id: this._id }, "3dL1k49$!2DnQ@1mP5oTz7#s", {
        expiresIn: "7d"
    })
}


module.exports = mongoose.model('User', userSchema);

// const mongoose =require('mongoose')

// const User =new mongoose.Schema({
//     username: {type:String, unique:true},
//     email: String,
//     phone: String,
//     password: String,
//     confirmPassword:String
// })

// const UserModel =mongoose.model("User", User)

// module.exports=UserModel
