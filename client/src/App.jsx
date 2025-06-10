import React from 'react'
import {Route, Routes} from "react-router-dom"
  import { ToastContainer} from 'react-toastify';
import Home from "./pages/Home"
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from "./pages/ResetPassword"
import ProtectedRoutes from './components/ProtectedRoutes';
import PublicRoute from './components/PublicRoutes';

const App = () => {
  return (
    <div>

      <ToastContainer/>
      <Routes>
        <Route path='/' element={<ProtectedRoutes><Home/></ProtectedRoutes>}/>
        <Route path='/login' element={<PublicRoute><Login/></PublicRoute>}/>
        <Route path='/verify-email' element={<PublicRoute><EmailVerify/></PublicRoute>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
      </Routes>

    </div>
  )
}

export default App
