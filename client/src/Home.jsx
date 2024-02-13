import React, { useState } from 'react';
import './Home.css'
import {Link} from "react-router-dom";
import axios from 'axios'


const Home=()=>{
    const handleSignIn=() =>{
        window.location='/signup'
    }

return(
    
<div className="home-container ">
        
    <div class="split-container">
      <div class="logo-container">
         <img className="logo" src="images/logo.png"/>
          <button onClick={handleSignIn} className="signup-button">Sign Up</button>
          <button className="login-button">Log In</button>
      </div>

      <header>
        <h2>Welcome to Your App</h2>
        <p>Connecting people, one message at a time.</p>
      </header>
    </div>

      <footer>
        <p>&copy; 2024 Blinker. All rights reserved.</p>
      </footer>
   
</div>


);


};

export default Home;