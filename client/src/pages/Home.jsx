import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'
import Login from '../components/Login';
import Register from '../components/Signup'


const Home=()=>{
  const  [changeWind, setChangeWind] = useState(false)
  
    const handleSignIn=() =>{
      //  window.location='/register'
      setChangeWind(true)
    }

    const handleLogin=() =>{
     // window.location='/login'
      setChangeWind(false)
  }

return(
    
<div className="home-container ">
        
    <div className="split-container">
      <div className="logo-container">
         <img className="logo" src="images/logo.png"/>
          <button onClick={handleSignIn} className="signup-button">Sign Up</button>
          <button onClick={handleLogin} className="login-button">Log In</button>
      </div>
      {!changeWind &&(<div><Login></Login></div>)}
      {changeWind&&(<div><Register></Register></div>)}

      
    </div>

      <footer>
        <p>&copy; 2024 Blinker. All rights reserved.</p>
      </footer>
   
</div>


);


};

export default Home;