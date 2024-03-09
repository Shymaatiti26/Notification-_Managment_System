import './UserPage.css'
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/Login';
import '../components/Profile';
import '../components/ScheduleMessage';
import Chat from '../components/Chat'
import { useAuthContext } from '../hooks/useAuthComtext';
import { Grid, GridItem,Input,Box } from '@chakra-ui/react'
import UserGroupsList from '../components/UserGroupsList';
import SearchComponent from '../components/SearchComponent'

//import { useLogout } from './hooks/useLogout';
const UserPage = ()=>{
    //const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
    const navigate = useNavigate();
    const {user} = useAuthContext()
    const {dispatch} =useAuthContext()
    const groupData=JSON.parse(localStorage.getItem('group'))
    const [searchQuery, setSearchQuery] = useState('');
    const [groups, setGroups] = useState([]);

    useEffect(()=>{


    })

    const handleProfile = async() =>{
      navigate('/Profile');
    }
    const handleMessage= async()=>{
      navigate('/ScheduleMessage');
    }
    const handleGroups=async()=>{
      navigate('/Groups');
    }
    const handleLogout = async () => {
            // remove user from storage
            localStorage.removeItem('user')
  
            // dispatch logout action
            dispatch({ type: 'LOGOUT' })
            navigate('/Home');


    };
  
    return(
        <div className='main-container'>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {user &&(
           
           <div className="navbar">
           <div className="navbar-left">
             <img className="navbar-logo" src="/images/logo.png" alt="Logo" />
           </div>
           <div className="navbar-center">
             <button className="navbar-button" >Home</button>
             <button className="navbar-button" onClick={handleMessage}>Send Message</button>
             <button className="navbar-button" onClick={handleGroups}>Groups</button>
           </div>
           <div className="navbar-right">
             <div className="navbar-username" onClick={toggleDropdown}>
               <span className="username">Welcome {user.username} &#9660;</span>
               <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
                 <button className="dropdown-item" onClick={handleProfile}>Profile</button>
                 <button className="dropdown-item" onClick={handleLogout}>Logout</button>
               </div>
             </div>
             
           </div>
         </div>)}
              (
              <Grid templateColumns='repeat(5, 1fr)' gap={6}>
                <GridItem w='100%' h='10'> <UserGroupsList></UserGroupsList></GridItem>
                <GridItem  w='100%' h='10' className='chat-box'> {groupData&&<Chat groupId={groupData.groupId} /> }</GridItem>
                
              </Grid>)
             
        </div>
    );

};

export default UserPage 