import React, { Children, useContext } from 'react'
import {AppContext} from '../context/AppContext'
import {Navigate} from 'react-router-dom'

const ProtectedRoutes = ({children}) => {
    const { isUserLoggedIn, userData } = useContext(AppContext);
    if(!isUserLoggedIn && !userData){
        return <Navigate to='/login' replace/>
    }
    return (
    children
)
}

export default ProtectedRoutes