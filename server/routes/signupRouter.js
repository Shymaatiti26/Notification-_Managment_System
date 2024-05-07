const express =require("express")
var router = express.Router();
const UsersModel = require('../models/User')
const app=express()

router.post('/signup',async(req,res)=>{
    const formData = req.body.formData;
  try{
     // Check if the username already exists
     const ExistingUser=await UsersModel.findOne({username:formData.username});
    if(ExistingUser){
        return res.json({success:false, message:'Username already exists' } )
    }
   // Username doesn't exist, create a new user
    UsersModel.create(formData)
    res.json({ success: true, message: 'User registered successfully' });

    }catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error });
  }
 
})

module.exports = router;