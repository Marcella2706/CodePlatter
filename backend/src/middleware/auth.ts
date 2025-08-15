import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config();

export const protect=(req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if(!token){
        return res.status(401).json({ 
            message: 'Not authorized, no token provided' 
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } 
    catch(error){
        console.error('Token verification error:', error);
        res.status(401).json({ 
            message: 'Invalid token' 
        });
    }
};