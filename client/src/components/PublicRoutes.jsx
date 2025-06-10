import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const PublicRoute = ({ children }) => {
  const { isUserLoggedIn} = useContext(AppContext);

  return !isUserLoggedIn ? children : <Navigate to="/" />;

};

export default PublicRoute;