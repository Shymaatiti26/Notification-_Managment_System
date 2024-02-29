import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const userId=localStorage.getItem('userId');
  const [isEditing, setIsEditing] = useState(false); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/me',userId);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    if (userId) {
      fetchUserData();
    }
  }, [userId]);  
  // useEffect(() => {
  //   const fetchUserProfile = async (req) => {
  //     try {
  //       const token = localStorage.getItem('token'); // Assuming you stored the JWT token in localStorage upon login
  //       console.log(token);
  //       const userId = localStorage.getItem('userId')
  //       const response = await axios.get('http://localhost:3001/api/v1/me', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         params: { userId }
  //       });
  //       setUser(response.data.user);
  //     } catch (error) {
  //       setError(error.response.data.message);
  //     }
  //   };

  //   fetchUserProfile();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log("username:",user.username);
  };

  const saveChanges = async () => {
    try {
      await axios.put('http://localhost:3001/api/v1/me/update', user); // Adjust endpoint accordingly
      setIsEditing(false); // Disable editing mode after saving changes
      console.log('Changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  return (
    <div>
    <h1>User Profile</h1>
    {isEditing ? ( // Render input fields when in editing mode
      <form>
        <div>
          <label>Name:</label>
          <input type="text" name="username" value={user.username} onChange={handleInputChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={user.email} onChange={handleInputChange} />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={user.phone} onChange={handleInputChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={user.password} onChange={handleInputChange} />
        </div>
        <button type="button" onClick={saveChanges}>Save Changes</button>
      </form>
    ) : ( // Render profile information as text when not in editing mode
      <div>
        <div>
          <strong>Name:</strong> {user.username}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Phone:</strong> {user.phone}
        </div>
        <div>
          <strong>Password:</strong> {user.password}
        </div>
        <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
      </div>
    )}
  </div>
);
};

export default ProfilePage;
