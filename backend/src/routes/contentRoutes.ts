import { Router } from "express";
import Category from "../models/Category";

const router = Router();

router.get('/', async (req, res) => {
    try{
        const {search, difficulty, page = 1, limit = 10, sortBy} = req.query;
        let questionFilter: any = {};
        if (search) questionFilter.title = {$regex: search as string, $options: 'i'};
        if (difficulty) questionFilter.difficulty = difficulty;

        let sort: any = {};
        if (sortBy) {
            const [field, order] = (sortBy as string).split('_');
            if (field) sort[field] = order === 'asc' ? 1 : -1;
        }

        const skip = (Number(page) - 1) * Number(limit);
        const categories = await Category.find()
            .populate({
                path: 'questions',
                match: questionFilter,
                options: {sort}
            })
            .skip(skip)
            .limit(Number(limit));

        res.json(categories);
    } 
    catch(err){
        res.status(500).json({message: 'Server error', error: err});
    }
});

export default router;
