import './UserPage.css'
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/Login';
import '../components/Profile';
import Chat from '../components/Chat'
import { useAuthContext } from '../hooks/useAuthComtext';
import { Grid, GridItem } from '@chakra-ui/react'
import UserGroupsList from '../components/UserGroupsList';


//import { useLogout } from './hooks/useLogout';
const UserPage = ()=>{
    //const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {user} = useAuthContext()
    const {dispatch} =useAuthContext()
    const groupData=JSON.parse(localStorage.getItem('group'))

    useEffect(()=>{


    })

    const handleProfile = async() =>{
      navigate('/Profile');
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
            {user &&(<div className='toolbar'>

                <div className='toolbar-username'>
                Welcome <br></br>{user.username}
                </div>
              <img className="toolbar-logo" src="/images/logo.png"/>
              <button className='logout-button' onClick={handleLogout}>Logout</button>
              <button className='logout-button' onClick={handleProfile}>Profile</button>
              </div>)}

              <Grid templateColumns='repeat(5, 1fr)' gap={6}>
                <GridItem w='100%' h='10'> <UserGroupsList></UserGroupsList></GridItem>
                <GridItem  w='100%' h='10' className='chat-box'> <Chat groupId={groupData.groupId} /> </GridItem>
                
              </Grid>
        </div>
    );

};

export default UserPage 