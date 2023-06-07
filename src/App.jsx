import {Routes, Route} from 'react-router-dom'
import './css/global.css'
import Nav from './components/Nav'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Mood from './pages/Mood'
import Signin from './pages/Signin'
import { AuthProvider } from '../context'
import RequireAuth from './components/RequireAuth'
import Dairy from './pages/Dairy'

function App() {

  return (
    <AuthProvider>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='signin' element={<Signin/>}/>
      <Route path='dashboard' element={<RequireAuth><Dashboard/></RequireAuth>}/>
      <Route path='mood' element={<RequireAuth><Mood/></RequireAuth>}/>
      <Route path='dairy' element={<RequireAuth><Dairy/></RequireAuth>}/>
    </Routes>
    </AuthProvider>
  )
}

export default App
