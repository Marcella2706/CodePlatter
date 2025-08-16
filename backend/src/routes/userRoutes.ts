import {Router} from "express";
import {authMiddleware} from "../middleware/auth"; 
import User, { IUser } from "../models/User";
import Question, { IQuestion } from "../models/Question";
import mongoose from "mongoose";

const router = Router();

// Type for populated user
interface PopulatedUser extends Omit<IUser, 'progress' | 'bookmarks'> {
    progress: IQuestion[];
    bookmarks: IQuestion[];
}

router.post('/progress', authMiddleware, async (req: any, res) => {
    try{
        const userId = req.user.id;
        const {questionId, completed} = req.body;
        
        if(!mongoose.Types.ObjectId.isValid(questionId)){
            return res.status(400).json({message: 'Invalid question ID'});
        }

        const question = await Question.findById(questionId);
        if(!question) return res.status(404).json({message: 'Question not found'});

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: 'User not found'});
        
        if(completed === false || completed === 'false') {
            // Remove from progress
            user.progress = user.progress.filter(id => !id.equals(questionId));
        } else {
            // Add to progress if not already there
            if(!user.progress.includes(questionId)){
                user.progress.push(questionId);
            }
        }
        
        await user.save();
        
        res.json({
            message: 'Progress updated successfully',
            completedQuestions: user.progress.map(id => id.toString())
        });
    }
    catch(err){
        console.error('Progress update error:', err);
        res.status(500).json({message: 'Server error', error: err});
    }
});

router.delete('/progress/:questionId', authMiddleware, async (req: any, res) => {
    try{
        const userId = req.user.id;
        const {questionId} = req.params;
        
        if(!mongoose.Types.ObjectId.isValid(questionId)){
            return res.status(400).json({message: 'Invalid question ID'});
        }

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: 'User not found'});
        
        user.progress = user.progress.filter(id => !id.equals(questionId));
        await user.save();
        
        res.json({
            message: 'Progress updated successfully',
            completedQuestions: user.progress.map(id => id.toString())
        });
    }
    catch(err){
        console.error('Progress remove error:', err);
        res.status(500).json({message: 'Server error', error: err});
    }
});

router.get('/progress', authMiddleware, async (req: any, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).populate('progress') as PopulatedUser | null;
        
        if(!user) return res.status(404).json({message: 'User not found'});
        
        res.json({
            completedQuestions: user.progress.map(q => q.id.toString()),
            totalCompleted: user.progress.length
        });
    }
    catch(err){
        console.error('Progress fetch error:', err);
        res.status(500).json({message: 'Server error', error: err});
    }
});

router.get('/progress/detailed', authMiddleware, async (req: any, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).populate('progress') as PopulatedUser | null;
        
        if(!user) return res.status(404).json({message: 'User not found'});
        
        const totalQuestions = await Question.countDocuments();
        
        const completedQuestions = user.progress.map(question => ({
            questionId: question,
            completedAt: new Date() // Consider adding timestamps to track when completed
        }));

        // Calculate stats by difficulty - now TypeScript knows about difficulty property
        const easyCompleted = user.progress.filter(q => q.difficulty === 'Easy').length;
        const mediumCompleted = user.progress.filter(q => q.difficulty === 'Medium').length;
        const hardCompleted = user.progress.filter(q => q.difficulty === 'Hard').length;

        const stats = {
            totalCompleted: user.progress.length,
            easyCompleted,
            mediumCompleted,
            hardCompleted,
            totalQuestions,
            completionPercentage: totalQuestions > 0 ? (user.progress.length / totalQuestions) * 100 : 0
        };
        
        res.json({
            completedQuestions,
            stats
        });
    }
    catch(err){
        console.error('Detailed progress fetch error:', err);
        res.status(500).json({message: 'Server error', error: err});
    }
});

router.post('/bookmarks', authMiddleware, async (req: any, res) => {
    try{
        const userId = req.user.id;
        const {questionId} = req.body;
        
        if(!mongoose.Types.ObjectId.isValid(questionId)){
            return res.status(400).json({message: 'Invalid question ID'});
        }

        const question = await Question.findById(questionId);
        if(!question) return res.status(404).json({message: 'Question not found'});

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: 'User not found'});
        
        if(!user.bookmarks.includes(questionId)){
            user.bookmarks.push(questionId);
            await user.save();
        }
        
        res.json({
            message: 'Bookmark added successfully',
            bookmarks: user.bookmarks.map(id => id.toString())
        });
    }
    catch(err){
        console.error('Bookmark add error:', err);
        res.status(500).json({message: 'Server error', error: err});
    }
});

router.delete('/bookmarks', authMiddleware, async (req: any, res) => {
    try{
        const userId = req.user.id;
        const {questionId} = req.body;
        
        if(!mongoose.Types.ObjectId.isValid(questionId)){
            return res.status(400).json({message: 'Invalid question ID'});
        }

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: 'User not found'});
        
        user.bookmarks = user.bookmarks.filter(id => !id.equals(questionId));
        await user.save();
        
        res.json({
            message: 'Bookmark removed successfully',
            bookmarks: user.bookmarks.map(id => id.toString())
        });
    }
    catch(err){
        console.error('Bookmark remove error:', err);
        res.status(500).json({message: 'Server error', error: err});
    }
});

router.get('/bookmarks', authMiddleware, async (req: any, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).populate('bookmarks') as PopulatedUser | null;
        
        if(!user) return res.status(404).json({message: 'User not found'});
        
        const bookmarks = user.bookmarks.map(question => ({
            _id: question._id,
            questionId: question
        }));
        
        res.json({
            bookmarks,
            totalBookmarks: user.bookmarks.length
        });
    }
    catch(err){
        console.error('Bookmarks fetch error:', err);
        res.status(500).json({message: 'Server error', error: err});
    }
});

router.get('/dashboard', authMiddleware, async (req: any, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId)
            .populate('bookmarks')
            .populate('progress') as PopulatedUser | null;
        
        if(!user) return res.status(404).json({message: 'User not found'});

        const totalQuestions = await Question.countDocuments();
        const completedCount = user.progress.length;
        const progressPercentage = totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;
        
        res.json({
            user: {
                name: user.name,
                email: user.email
            },
            stats: {
                totalQuestions,
                completedQuestions: completedCount,
                bookmarkedQuestions: user.bookmarks.length,
                progressPercentage: Math.round(progressPercentage * 100) / 100
            },
            recentProgress: user.progress.slice(-5), 
            bookmarks: user.bookmarks,
            progress: user.progress.map(q => q.id.toString())
        });
    }
    catch(err){
        console.error('Dashboard fetch error:', err);
        res.status(500).json({message: 'Server error', error: err});
    }
});

export default router;