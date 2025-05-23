import React from 'react'
import {assets} from '../assets/assets'
import {useNavigate} from 'react-router-dom'

const Navbar = () => {

  const navigate=useNavigate();

  return (
    <div  className='w-full flex justify-between items-center p-4 sm:p-6 sm-px-24 
    absolut top-0'>
        <img src={assets.logo} className='w-28 sm:w-32' />
        <button 
        onClick={()=>navigate('/login')}
        className='flex items-center border border-gray-500 gap-2
        rounded-full px-6 py-2 text-gray-800  hover:bg-gray-100 transition-all'>
            Login
            <img src={assets.arrow_icon} alt="" className='' />
        </button>

    </div>
  )
}

export default Navbar