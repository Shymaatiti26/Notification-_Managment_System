import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup'
import Home from './Home'
import Login from './Login'
import Welcome from './Welcome'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MessageForm from './MessageForm'

function App() {
  const [count, setCount] = useState(0)
  //const username="carol"
// <Route path='/Chat/:username' element={<Chat  room='0' username={username}/>}></Route>
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/Signup' element={<Signup/>}></Route>
      <Route path='/Home' element={<Home/>}></Route>
      <Route path='/Login' element={<Login/>}></Route>
      <Route path='/Welcome' element={<Welcome/>}></Route>
      <Route path='/MessageForm' element={<MessageForm/>}></Route>
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
