import jwt from 'jsonwebtoken'

const userAuth=(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Not Authorized.Login again"
        })
    }

    try{

        const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).json({success:false,message:"Not Authorized.Login again"});
        }
        req.userId = decodedToken.id;    

        next();

    }catch(error){
        console.error(error.message);
        res.status(401).json({success:false,message:error.message});
    }
}

export default userAuth;