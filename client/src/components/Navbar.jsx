import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {

  const navigate=useNavigate();
  const {userData,backendUrl,setUserData,setIsUserLoggedIn}=useContext(AppContext);

  const sendVerificationOtp=async()=>{
    try{
      axios.defaults.withCredentials=true;

      
      const {data}=await axios.post(backendUrl+'/api/auth/send-verify-otp');
      
      if(data.success){
        navigate('/verify-email');
        toast.success(data.message);
        
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message);

    }
  }

  const logout=async()=>{
    try{
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(backendUrl+'/api/auth/logout');
      data.success && setIsUserLoggedIn(false);
      data.success && setUserData(false)
      navigate('/');

    }catch(error){
      toast.error(error.message);
    }
  }

  return (
    <div  className='w-full flex justify-between items-center p-4 sm:p-6 sm-px-24 
    absolut top-0'>
        <img src={assets.logo} className='w-28 sm:w-32' />
        {userData?
        <div className='w-8 h-8 rounded-full flex mr-8 group relative justify-center items-center bg-black text-white '>
          {userData.name[0].toUpperCase()}
          <div className='hidden group-hover:block z-10 text-black  rounded pt-10
          top-0 right-0 absolute'>
           <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
            {!userData.isAccountVerified && 
              <li onClick={sendVerificationOtp} className='px-2 py-1 hover:bg-gray-200 cursor-pointer'>Verify Email</li>
}
            <li onClick={logout} className='px-2 py-1 hover:bg-gray-200 cursor-pointer  pr-10'>Logout</li>
           </ul>

          </div>
        </div>
        :<button 
        onClick={()=>navigate('/login')}
        className='flex items-center border border-gray-500 gap-2
        rounded-full px-6 py-2 text-gray-800  hover:bg-gray-100 transition-all'>
            Login
            <img src={assets.arrow_icon} alt="" className='' />
        </button>
        }

    </div>
  )
}

export default Navbar