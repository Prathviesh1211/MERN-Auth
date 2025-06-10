import { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import {AppContext} from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const EmailVerify = () => {
  axios.defaults.withCredentials=true;
  const{backendUrl,userData,isUserLoggedIn,getUserData}=useContext(AppContext)

  const navigate=useNavigate();
  const inputRefs=useRef([]);

  const handleInput=(e,index)=>{
    if(e.target.value.length>0 && index<inputRefs.current.length-1){
      inputRefs.current[index+1].focus();
    }
  }

  const handleKeyDown=(e,index)=>{
    if(e.key==="Backspace" && e.target.value=='' && index>0){
      inputRefs.current[index-1].focus();
    }
  }

  const handlePaste=(e)=>{
    const paste=e.clipboardData.getData('text');
    const pasteArrray=paste.split('');
    pasteArrray.forEach((char,index)=> {
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char;
      }
    });
    const lastInd=Math.min(pasteArrray.length,inputRefs.current.length-1);
    inputRefs.current[lastInd]?.focus();
  }

  const onSubmitHandler=async(e)=>{ 
    try{
      e.preventDefault();
      const otpArray=inputRefs.current.map(e=>e.value);
      const otp=otpArray.join('');

      const {data}=await axios.post(backendUrl+'/api/auth/verify-email',{otp}); 

      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/')
      }else{
        toast.error(data.message);
      }

    }catch(error){
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    isUserLoggedIn && userData && userData.isAccountVerified && navigate('/');
  },[isUserLoggedIn,userData])

  return ( 
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-[#cbd5e1] via-[#94a3b8] to-[#64748b]'>
      <img src={assets.logo} onClick={()=>navigate('/')}
      className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'    />
      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email verification OTP</h1>
        <p className='text-center mb-6 text-indigo-400'>Enter the 6-digit code sent to your email.</p>
        <div className='flex justify-between mb-8' onPaste={(e)=>handlePaste(e)}>
          {Array(6).fill(0).map((_,index)=>(
            <input type='text' maxLength={1} key={index} required
            className='size-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
            ref={e=>inputRefs.current[index]=e}
            onInput={(e)=>handleInput(e,index)}    
            onKeyDown={(e)=>handleKeyDown(e,index)}  />
          ))}
        </div>
        <button className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500
         to-indigo-800 text-white'>Verify Email</button>
      </form>
    </div>
  )
}

export default EmailVerify