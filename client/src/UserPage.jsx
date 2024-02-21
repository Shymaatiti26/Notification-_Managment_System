import React, { useState } from 'react';
import './UserPage.css'
import { useParams } from 'react-router-dom';
import axios from 'axios'

const UserPage = ()=>{
    const { username } = useParams();


    
    return(
        <div className='main-container'>
            <dive className='toolbar'>
                <div className='toolbar-username'>
                Welcome <br></br>{username}
                </div>
              <img className="toolbar-logo" src="/images/logo.png"/>
              <button className="logout-button">Logout</button>

            </dive>
            <dive>
                <h3>Welcome, {username}</h3>
                <br></br>
            </dive>
        </div>
    );

};

export default UserPage 