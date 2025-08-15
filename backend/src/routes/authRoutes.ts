import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';

dotenv.config();

const router = Router();

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

export default router;