import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import Home from './Home'
import Login from './Login'
import Welcome from './Welcome'
import UserPage from './UserPage'
import Chat from './Chat'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MessageForm from './MessageForm'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/Signup' element={<Signup/>}></Route>
      <Route path='/Home' element={<Home/>}></Route>
      <Route path='/Login' element={<Login/>}></Route>
      <Route path='/Welcome' element={<Welcome/>}></Route>
      <Route path='/MessageForm' element={<MessageForm/>}></Route>
      <Route path='/UserPage/:username' element={<UserPage/>}></Route>
      <Route path='/Chat/:username' element={<Chat />}></Route>
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
