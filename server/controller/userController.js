import User from "../model/userModel.js";

export const getUserData=async(req,res)=>{
    try{
        const userId=req.userId;
        const user=await User.findById(userId);

        if(!user){
            return res.status(404).json({success:false,message:"User Not Found!!!"});
        }

        res.status(200).json({success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        })

    }catch(error){
        console.error("Error fetching User data :",error);
        res.status(500).json({success:false,message:error.message});
    }

}