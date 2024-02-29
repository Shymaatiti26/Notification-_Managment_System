import './UserPage.css'
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login';
import './Profile';
const UserPage = ()=>{
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
      const fetchUserProfile = async (req) => {
        try {
          const token = localStorage.getItem('token'); // Assuming you stored the JWT token in localStorage upon login
          console.log(token);
          const userId = localStorage.getItem('userId')
          const response = await axios.get('http://localhost:3001/api/v1/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { userId }
          });
          setUser(response.data.user);
        } catch (error) {
          setError(error.response.data.message);
        }
      };
  
      fetchUserProfile();
    }, []);
  
    const handleProfile = async() =>{
      navigate('/Profile');
    }
    const handleLogout = async () => {
      try {
        // Make a logout request to the backend API
        const res=await axios.post('http://localhost:3001/api/v1/logout');
        if(res.data.success){
          localStorage.setItem("token",null)
          localStorage.setItem("userId",null)
          // If logout is successful, redirect the user to the login page
          navigate('/login'); // Adjust the route according to your application's setup
        }
        
      } catch (error) {
        console.error('Logout failed:', error);
        // Handle logout failure, if needed
      }
    };
    
    return(
        <div className='main-container'>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {user &&(<div className='toolbar'>
                <div className='toolbar-username'>
                Welcome <br></br>{user.name}
                </div>
              <img className="toolbar-logo" src="/images/logo.png"/>
              <button onClick={handleLogout}>Logout</button>
              <button onClick={handleProfile}>Profile</button>
            </div>)}
            {user && (<div>
                <h3>Welcome, {user.name} </h3>
                <br></br>
            </div>)}
        </div>
    );

};

export default UserPage 