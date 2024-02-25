import './UserPage.css'
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPage = ()=>{
    //const { username } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchUserProfile = async (req) => {
        try {
          const token = localStorage.getItem('token'); // Assuming you stored the JWT token in localStorage upon login
          console.log("tokenbelow");
          console.log(token);
          const response = await axios.get('http://localhost:3001/api/v1/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
        } catch (error) {
          setError(error.response.data.message);
        }
      };
  
      fetchUserProfile();
    }, []);
  

    
    return(
        <div className='main-container'>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {user &&(<div className='toolbar'>
                <div className='toolbar-username'>
                Welcome <br></br>{user.name}
                </div>
              <img className="toolbar-logo" src="/images/logo.png"/>
              <button className="logout-button">Logout</button>

            </div>)}
            {user && (<div>
                <h3>Welcome, {user.name}</h3>
                <br></br>
            </div>)}
        </div>
    );

};

export default UserPage 