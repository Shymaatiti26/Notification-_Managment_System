
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import { useAuthContext } from '../hooks/useAuthComtext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {dispatch} =useAuthContext()

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      const response = await axios.post('http://localhost:3001/api/v1/login', { email, password });
      //const token = response.data; // Assuming the response contains token or user data

      //localStorage.setItem('token',token);
      console.log(response.data);
      //save the user to local storage
      localStorage.setItem('user',JSON.stringify(response.data));

      //update the auth context
      dispatch({type: 'LOGIN', payload:response.data})



      // Redirect to dashboard or perform any other action upon successful login
      navigate("/UserPage");
    } catch (error) {
      setError(error.response);
    }
  };

  return (
    
    <div className="login-container" style={{width:'100%'}}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
  <form className="login-form" onSubmit={handleSubmit}>
    <h1>Welcome Back</h1>
    <p>Please login to your account</p>
    <div className="input-group">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Email'/>
    </div>
    <div className="input-group">
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Password'/>
    </div>
    <button type="submit">Login</button>
    <div className="bottom-text">
      <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
    </div>
  </form>
</div>
  );
};

export default Login;
