const mongoose =require('mongoose')

const User =new mongoose.Schema({
    username: String,
    email: String,
    phone: String,
    password: String,
    confirmPassword:String
})

const UserModel =mongoose.model("User", User)
module.exports=UserModel