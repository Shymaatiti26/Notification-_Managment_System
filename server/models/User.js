const mongoose =require('mongoose')

const User =new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
})

const UserModel =mongoose.model("User", User)
module.exports=UserModel