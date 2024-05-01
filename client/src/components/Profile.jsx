import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  HStack,
  VStack,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const ProfilePage = () => {
  const [user, setUser] = useState('');
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupExistErr, setGroupExistErr] = useState();
  const[successMsg,setSuccessMsg] =useState(false);

  useEffect(() => {
    
    const fetchUserProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));

        /*
        localStorage.setItem(
          "group",
          JSON.stringify({ groupId: groupId, groupName: groupName })
        );*/
        const userId = userData._id;
        
        const response = await axios.get('http://localhost:3001/api/v1/me', {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          params: { userId },
});
        setUser(response.data.user);
      } catch (error) {
        setError(error.response.data.message);
      }
    };

    fetchUserProfile(); // Call the function when the component mounts
    setSuccessMsg(false);

  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async () => {
    event.preventDefault();
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
      setSuccessMsg(true);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };
  return (
    <div>
            <button onClick={onOpen}> Profile </button>

<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalCloseButton color={"black"} />
    <ModalBody pb={6}>
     <h1 className="title">My profile</h1>
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
         
        {successMsg && (<div className="successMsg">changes saved</div>)}
       
             </form>
        
      ) : (
        <div>Loading...</div> // Render loading message while user data is being fetched
      )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>

  );
  
};

export default ProfilePage;