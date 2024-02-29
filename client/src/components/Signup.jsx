// src/Register.js
import React, { useState } from 'react';
import './Signup.css'
import {Link, json, useNavigate} from "react-router-dom";
import axios from 'axios'
import { useAuthContext } from '../hooks/useAuthComtext';



const Register = () => {
  const {dispatch} =useAuthContext()
  var confirmPass;
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone:'',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [showPasswordMismatchAlert,setShowPasswordMismatchAlert]=useState(false);
  const[showUserExistAlert,setShowUserExistAlert]=useState(false);
  //const[InputError,setInputError]=useState(false);

  //send form data and wait to response function
  const registerUser = async (formData) => {
    try{
    const response= await axios.post('http://localhost:3001/api/v1/register',formData);
    return response;
    }catch(error){
        throw error;
    }
  };


  

  const handleSubmit = async(e) => {
     e.preventDefault();
    const responseData=await registerUser(formData);

    //check if user name exist show error msg
    if(responseData.data.success===false){
        setShowUserExistAlert(true)
    }else{
      //save the user to local storage
      localStorage.setItem('user',JSON.stringify(responseData.data));

      //update the auth context
      dispatch({type: 'LOGIN', payload:responseData.data})


        navigate("/UserPage")
        setShowUserExistAlert(false)
    }

    // //check if the password and the confirmation password are not the same write error msg 
    // if(formData.password !== formData.confirmPassword){
    
    //     setShowPasswordMismatchAlert(true) //show the error msg

    // }else{
    //   setShowPasswordMismatchAlert(false)  //hide the error password msg

    // }

  };

  return (
    
    <div className="form-wrapper" style={{backgroundColor:'white'}}>
    <h1 className="title">Sign up</h1>
    <form className="form"onSubmit={handleSubmit}>
      <div className="form-row">
        
        <div className="form-group">
          <label>
            <span className="sr-only">User Name</span>
            <input id="username" name="username" type="text" placeholder="User Name" className="form-input" required value={formData.username}
            onChange={handleInputChange}/>
          </label>
        </div>
      </div>
      <div className="form-group">
        <label>
          <span className="sr-only">Email</span>
          <input type="email" name="email" placeholder="Email" className="form-input" required value={formData.email}
            onChange={handleInputChange}/>
        </label>
      </div>
      <div className="form-group">
        <label>
          <span className="sr-only">Phone</span>
          <input type="text" name="phone" placeholder="Phone" className="form-input" required value={formData.phone}
            onChange={handleInputChange}/>
        </label>
      </div>
      <div className="form-group">
        <label>
          <span className="sr-only">Password</span>
          <input type="password" name="password" placeholder="Password" className="form-input" required value={formData.password}
            onChange={handleInputChange}/>
        </label>
      </div>
      <br />

{showPasswordMismatchAlert && (
  <div className="error">
    Passwords do not match. Please check and try again.
  </div>
)}

 {showUserExistAlert && (
  <div className="error">
    Email is already used
  </div>
)}
      <div className="form-group">
        <input type="submit" value="Register" className="form-submit"/>
      </div>

      <footer className="form-footer">
          <div>
            Already have an account?
            <Link to="/login" className="form-link">Log in</Link>
          </div>
      </footer>
    </form>
  </div>

  );
};

export default Register;
