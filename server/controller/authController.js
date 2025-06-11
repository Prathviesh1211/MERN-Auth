import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../model/userModel.js'
import transporter from '../config/nodeMailer.js'
import {EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE} from '../config/emailTemplates.js' 

export const signup=async(req,res)=>{
    const {name,password,email}=req.body;

    if(!name || !password || !email){
        return res.status(400).json({success:false,message:"All fields are required"})
    }

    try{

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=new User({name,email,password:hashedPassword});
        await user.save()

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production"?"none":"strict",
            maxAge:7*24*60*60*1000 //=>7-days
        })

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'Welcome to PrimeAuth',
            text:`Welcome to PrimeAuth website. Your
            account has been created with email id: ${email}`
        }
        
        await transporter.sendMail(mailOptions)

        res.status(200).json({
            success:true,
            message:"User Created Successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })

    }catch(error){
        console.error("Signup Error :",error);
        res.status(500).json({
            success:false,
            message:error.message 
        })
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(401).json({
            success:false,
            message:"All fields are required!"
        })
    }

    try{

        const user=await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid Credentials!!!"
            })
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials!!!"
            })
        }

        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })

        res.status(200).json({
            success:true,
            message:"Login successful",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            }
        })


    }catch(error){
        console.error("Login error:",error)
        res.status(500).message("Internal Server Error")
    }
}

export const logout=async(req,res)=>{

     try{       

        res.clearCookie("token",{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })

        res.status(200).json({
            success:true,
            message:"Logout Successfull",
        })


    }catch(error){
        console.error("Logout error:",error)
        res.status(500).json({
            success:false,
            message:error.message
        })
    }

}

export const getAll=async(req,res)=>{
    try{
        const users=await User.find();

        res.status(200).json({
            users
        })
    }catch(error){
        console.error("Error:",error)
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const sendVerifyOtp=async(req,res)=>{
        
    try{
        const userId = req.userId;

        const user=await User.findById(userId);

        if(user.isAccountVerified){
            return res.status(401).json({success:false,message:"Account already verified"});
        }

        const otp=String(Math.floor(100000+Math.random()*900000))
        user.verifyOtp=otp;
        user.verifyOtpExpiresAt=Date.now()+24*60*60*1000

        await user.save();

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account Verification OTP',
            // text:`Your OTP is ${otp}. Verfiy your account 
            // using this OTP`
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({success:true,message:"Verification OTP sent on email"})


    }catch(error){
        console.error("Error sending OTP :",error);
        res.status(500).json({
            success:false,
            message:error.message 
        })
    }
}

export const verifyEmail=async(req,res)=>{

    const userId=req.userId;
    const {otp}=req.body;

    if(!userId || !otp){
        return res.status(401).json({
            success:false,
            message:"Missing Details"
        })
    }

    try{

        const user=await User.findById(userId);

        if(!user){      
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
    
        if(user.verifyOtp === '' || user.verifyOtp!==otp){
            return res.status(401).json({
                success:false,
                message:"Invalid OTP"
            })
        }
        
        if(user.verifyOtpExpiresAt<Date.now()){
            return res.status(401).json({
                success:false,
                message:"OTP Expired"
            })
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpiresAt=0;

        await user.save();

        res.status(200).json({
            success:true,
            message:"Email Verified successfully"
        });

    }catch(error){
        console.error("Error verifying email :",error);
        res.status(500).json({
            success:false,
            message:error.message 
        })
    }

}

export const isAuthenticated=async(req,res)=>{
    try{
        res.status(200).json({
            success:true,
            message:"User is Authenticated"
        });

    }catch(error){
        console.error("Error Authentication :",error);
        res.status(500).json({
            success:false,
            message:error.message 
        })
    }
}

export const sendResetOtp=async(req,res)=>{

    const {email}=req.body;

    if(!email){
        return res.json({success:false,message:"Email is required!!!"})
    }

    try{

        const user=await User.findOne({email});

        if(!user){
            return res.json({success:false,message:"User Not found"});
        }
        
        const otp=String(Math.floor(100000+Math.random()*900000))
        user.resetOtp=otp;
        user.resetOtpExpiresAt=Date.now()+15*60*1000

        await user.save();

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Password Reset OTP',
            // text:`Your OTP to reset your password is: ${otp}. It will expire in 15 minutes.`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }


        await transporter.sendMail(mailOptions);

        res.status(200).json({success:true,message:"Reset-password OTP sent to Email "})

    }catch(error){
        console.error("Error sending reset OTP :",error);
        res.status(500).json({
            success:false,
            message:error.message 
        })
    }
}

export const resetPassword=async(req,res)=>{

    const {email,otp,newPassword}=req.body;
    
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:"All fields are required"})
    }

    try{

        const user=await User.findOne({email});

        if(!user){
            return res.json({success:false,message:"User Not found"});
        }

        if(user.resetOtp==="" || user.resetOtp!==otp){
            return res.json({success:false,message:"Invalid OTP"});
        }

        if(user.resetOtpExpiresAt<Date.now()){
            return res.json({success:false,message:"OTP has expired"})
        }

        const hashedPassword=await bcrypt.hash(newPassword,10);

        user.password=hashedPassword;
        user.resetOtp="";
        user.resetOtpExpiresAt=0;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful."
        });

    }catch(error){
        console.error("Error reseting password :",error);
        res.status(500).json({success:false,message:error.message});
    }
}