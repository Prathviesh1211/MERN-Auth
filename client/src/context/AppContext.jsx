import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext=createContext();

export const AppContextProvider=(props)=>{

    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const [isUserLoggedIn,setIsUserLoggedIn]=useState(false);
    const [userData,setUserData]=useState(false);

    const getAuthState=async()=>{

        try{
            const {data}=await axios.post(backendUrl+'/api/aut/is-auth');
            if(data.success){
                setIsUserLoggedIn(true);
                getUserData();
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const getUserData=async ()=>{
        try{

            const { data } = await axios.get(backendUrl + '/api/user/data', {
  withCredentials: true,
});

            if(data.success){
                setUserData(data.userData);
            }else{
                toast.error(data.message);
            }

        }catch(error){
              toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(()=>{
        getAuthState(); 
    },[])

    const value={
        backendUrl,
        isUserLoggedIn,setIsUserLoggedIn,
        userData,setUserData,
        getUserData
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}