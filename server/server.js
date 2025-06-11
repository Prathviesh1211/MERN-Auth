import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import connectDb from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js'

dotenv.config();
connectDb();

const app=express();
const PORT=process.env.PORT || 5001
const allowedOrigins=['https://mern-auth-backend-475m.onrender.com']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}))

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter);

app.get('/',(req,res)=>{
    res.send("API working!!!!!")
})

app.listen(PORT,()=>{
    console.log(`Server Running at : ${PORT}`)
})
