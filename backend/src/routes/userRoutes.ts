import {Router} from "express";
import {protect} from "../middleware/auth";
import User from "../models/User";
import mongoose from "mongoose";

const router = Router();

router.post('/progress', protect, async (req, res) => {
    try{
        const userId = (req as any).user._id;
        const {questionId} = req.body;
        if(!mongoose.Types.ObjectId.isValid(questionId)){
            return res.status(400).json({message: 'Invalid question ID'});
        }
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: 'User not found'});
        if(!user.progress.includes(questionId)){
            user.progress.push(questionId);
            await user.save();
        }
        res.json(user.progress);
    }
    catch(err){
        res.status(500).json({message: 'Server error', error: err});
    }
});

router.get('/bookmarks', protect, async (req, res) => {
    try{
        const userId = (req as any).user._id;
        const user = await User.findById(userId).populate('bookmarks');
        res.json(user?.bookmarks || []);
    }catch(err){
        res.status(500).json({message: 'Server error', error: err});
    }
});

export default router;
