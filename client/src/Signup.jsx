// src/Register.js
import React, { useState } from 'react';
import './Signup.css'
import {Link} from "react-router-dom";
import axios from 'axios'


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone:'',
    password: '',
    confirmPassword:''
  });

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
    const response= await axios.post('http://localhost:3001/signup',{formData});
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
        setShowUserExistAlert(false)
    }

    //check if the password and the confirmation password are not the same write error msg 
    if(formData.password !== formData.confirmPassword){
    
        setShowPasswordMismatchAlert(true) //show the error msg

    }else{
      setShowPasswordMismatchAlert(false)  //hide the error password msg

    }

  };

  return (
    <div class="register-container" >
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            className={showUserExistAlert ? 'errorMsg':''}
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Confirm Password:
          <input
          className={showPasswordMismatchAlert ? 'errorMsg':''}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        {showPasswordMismatchAlert && (
          <div div class="error">
            Passwords do not match. Please check and try again.
          </div>
        )}

         {showUserExistAlert && (
          <div class="error">
            Username is already used
          </div>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
