import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user',{token}));
        /*
        localStorage.setItem(
          "group",
          JSON.stringify({ groupId: groupId, groupName: groupName })
        );*/
        const userId = JSON.parse(localStorage.getItem('user',{_id}));
        const response = await axios.get('http://localhost:3001/api/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId },
});
        setUser(response.data.user);
      } catch (error) {
        setError(error.response.data.message);
      }
    };

    fetchUserProfile(); // Call the function when the component mounts

  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async () => {
    const userData = {
      id:user._id,
      username: user.username,
      email: user.email,
      phone: user.phone
    };
    console.log("userData",userData);
    try {
      await axios.put('http://localhost:3001/api/v1/me/update',userData); // Adjust endpoint accordingly
      console.log('Changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };
  return (
    <div>
     <h1 className="title">Your Details</h1>
      {user ? ( // Render content if user is not null
             <form className="form"onSubmit={handleSubmit}>
               <div className="form-row">
                 
                 <div className="form-group">
                   <label>
                     <span className="sr-only">Name</span>
                     <input id="username" name="username" type="text" className="form-input" required value={user.username}
                     onChange={handleInputChange}/>
                   </label>
                 </div>
               </div>
               <div className="form-group">
                 <label>
                   <span className="sr-only">Email</span>
                   <input type="email" name="email"  className="form-input" required value={user.email}
                     onChange={handleInputChange}/>
                 </label>
               </div>
               <div className="form-group">
                 <label>
                   <span className="sr-only">Phone</span>
                   <input type="text" name="phone" className="form-input" required value={user.phone}
                     onChange={handleInputChange}/>
                 </label>
               </div>
              
               <br />
         
               <div className="form-group">
                 <input type="submit" value="Save" className="form-submit"/>
               </div>
         
             </form>
        
      ) : (
        <div>Loading...</div> // Render loading message while user data is being fetched
      )}
    </div>
  );
  
};

export default ProfilePage;