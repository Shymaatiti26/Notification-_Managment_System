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



  const handleSubmit = (e) => {
    e.preventDefault();
    
    //check if the password and the confirmation password are not the same write error msg 
    if (formData.password!==formData.confirmPassword){
        setShowPasswordMismatchAlert(true)

    }else{
      setShowPasswordMismatchAlert(false)  //hide the error password msg
    //send form data and wait to response
    //const respone= await axios.post('http://localhost:3001/signup',{formData});
    axios.post('http://localhost:3001/signup',{formData})
    .then(result => console.log(result))
    .catch(err=> console.log(err))
    //console.log('Form data submitted:', formData);
  

    }

  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
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
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        {showPasswordMismatchAlert && (
          <div style={{ color: 'red' }}>
            Passwords do not match. Please check and try again.
          </div>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
