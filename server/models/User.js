const mongoose =require('mongoose')

const User =new mongoose.Schema({
    username: {type:String, unique:true ,required: true},
    email: String,
    phone: String,
    password: String,
    confirmPassword:String
})

const UserModel =mongoose.model("User", User)

module.exports=UserModel