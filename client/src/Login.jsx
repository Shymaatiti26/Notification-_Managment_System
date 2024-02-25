// // src/components/Login.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
// import axios from 'axios';
// import './Login.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); // Initialize useNavigate hook

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3001/api/v1/login', { email, password });
//       console.log(response.data);
//       // Redirect to another page upon successful login
//       if(response.data.succsess){
//       navigate('/welcome'); // Use navigate function to redirect
//       }else{
//         alert("Wrong Email or Password");

//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       // Handle login failure
//       alert('Invalid Email or password');
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signUp = () => {
    navigate("./register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/v1/login', { email, password });
      console.log(response.data); // Assuming the response contains token or user data
      // Redirect to dashboard or perform any other action upon successful login
      navigate("./UserPage");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="loginButton github center" onClick={signUp}>
                    Sign Up
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
