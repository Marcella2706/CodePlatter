import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import { authMiddleware } from '../middleware/auth';
import nodemailer from 'nodemailer';

dotenv.config();

const router = Router();

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const limiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', limiter, async(req, res)=>{
    try{
        const {name,email,password }=req.body;

        if(!name || !email || !password){
            return res.status(400).json({ 
                message: 'Name, email, and password are required' 
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ 
                message: 'User already exists with this email' 
            });
        }

        const hashed = await bcrypt.hash(password, 10);
  
        const user = await User.create({ 
            name, 
            email, 
            password: hashed 
        });

        const userResponse={
            _id: user._id,
            name: user.name,
            email: user.email
        };

        res.status(201).json({ 
            message: 'User registered successfully',
            user: userResponse 
        });
    } 
    catch(error){
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Server error during registration' 
        });
    }
});

router.post('/login', limiter, async(req, res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        const user = await User.findOne({email});
        if(!user || !(await bcrypt.compare(password, user.password.toString()))){
            return res.status(400).json({ 
                message: 'Invalid credentials' 
            });
        }

        const token = jwt.sign(
            {id: user._id}, 
            process.env.JWT_SECRET as string, 
            {expiresIn: '1d'}
        );

        const userResponse={
            _id: user._id,
            name: user.name,
            email: user.email
        };

        res.json({ 
            token, 
            user: userResponse 
        });
    } 
    catch(error){
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error during login' 
        });
    }
});

router.get('/current-user', authMiddleware, async (req: any, res: Response) => {
    try{
        const user=await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.json({user});
    }
    catch(error){
        console.error('Fetch user error:', error);
        res.status(500).json({message: 'Server error fetching user'});
    }
});

router.put('/update',authMiddleware,async(req:any,res:Response)=>{
    try{
        const{name,email}=req.body;
        const updatedUser=await User.findByIdAndUpdate(
            req.user.id,
            {name,email},
            {new:true}
        ).select('-password');

        res.json({message:'Profile updated successfully',user:updatedUser});
    }
    catch(error){
        console.error('Update error:',error);
        res.status(500).json({message:'Server error updating profile'});
    }
});

router.put('/update-password',authMiddleware,async(req:any,res:Response)=>{
    try{
        const{currentPassword,newPassword}=req.body;
        const user=await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        const isMatch=await bcrypt.compare(currentPassword,user.password.toString());
        if(!isMatch){
            return res.status(400).json({message:'Current password is incorrect'});
        }

        user.password=await bcrypt.hash(newPassword,10);
        await user.save();

        res.json({message:'Password updated successfully'});
    }
    catch(error){
        console.error('Password update error:',error);
        res.status(500).json({message:'Server error updating password'});
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({message: 'User not found'});

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        otpStore.set(email, {otp, expiresAt: Date.now() + 5 * 60 * 1000}); 

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is: ${otp}. It expires in 5 minutes.`
        });

        res.json({message: 'OTP sent to email'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error sending OTP'});
    }
});

router.post('/verify-otp', (req, res) => {
    const {email, otp} = req.body;
    const record = otpStore.get(email);

    if (!record) return res.status(400).json({message: 'No OTP found for this email'});
    if (Date.now() > record.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({message: 'OTP expired'});
    }
    if (record.otp !== otp) return res.status(400).json({message: 'Invalid OTP'});

    const token = jwt.sign({email}, process.env.JWT_SECRET!, {expiresIn: '10m'});

    res.json({message: 'OTP verified', token});
});

router.post('/reset-password', async (req, res) => {
    try {
        const {token, newPassword} = req.body;
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await User.findOne({email: decoded.email});
        if (!user) return res.status(404).json({message: 'User not found'});

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        otpStore.delete(decoded.email);

        res.json({message: 'Password reset successful'});
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Invalid or expired token'});
    }
});

export default router;