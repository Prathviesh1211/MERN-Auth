import express from 'express'
import { getAll, isAuthenticated, login, logout, resetPassword, sendResetOtp, sendVerifyOtp, signup, verifyEmail } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const router=express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
router.post('/send-verify-otp',userAuth,sendVerifyOtp);
router.post('/verify-email',userAuth,verifyEmail);
router.post('/is-auth',userAuth,isAuthenticated);
router.post('/send-reset-otp',sendResetOtp);
router.post('/reset-password',resetPassword);

// router.get('/',getAll)

export default router;
