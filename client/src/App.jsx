import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Register from './Signup'
import Home from './Home'
import Login from './Login'
import Welcome from './Welcome'
import UserPage from './UserPage'
import Chat from './Chat'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ScheduleMessage from './ScheduleMessage'
import ProfilePage from './Profile'
import CreateGroup from './CreateGroup'
//import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/Welcome' element={<Welcome />} />
        <Route path='/Chat/:username' element={<Chat />} />
        <Route path='/Profile' element={<ProfilePage />} />
        <Route path='/ScheduleMessage' element={<ScheduleMessage />} />
        <Route path='/CreateGroup' element={<CreateGroup/>}/>
        
    </Routes>
    </BrowserRouter>
 /*   
<div>
<Signup/>
</div>
*/
  )
}

export default App
