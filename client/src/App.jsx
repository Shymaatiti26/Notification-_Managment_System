import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Register from './components/Signup'
import Home from './pages/Home'
import Login from './components/Login'
import UserPage from './pages/UserPage'
import Chat from './components/Chat'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ScheduleMessage from './components/ScheduleMessage'
import ProfilePage from './components/Profile'
import CreateGroup from './components/CreateGroup'
import { AuthContextProvider } from './context/AuthContext'
//import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <AuthContextProvider>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/Chat/:username' element={<Chat />} />
        <Route path='/Profile' element={<ProfilePage />} />
        <Route path='/ScheduleMessage' element={<ScheduleMessage />} />
        <Route path='/CreateGroup' element={<CreateGroup/>}/>
        
    </Routes>
    </AuthContextProvider>
    </BrowserRouter>
 /*   
<div>
<Signup/>
</div>
*/
  )
}

export default App
