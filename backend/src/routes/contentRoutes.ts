import { Router } from "express";
import Category from "../models/Category";

const router = Router();

const getDifficultySortStage = (order: string) => {
    const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    return {
        $addFields: {
            difficultySort: {
                $switch: {
                    branches: [
                        { case: { $eq: ["$difficulty", "Easy"] }, then: 1 },
                        { case: { $eq: ["$difficulty", "Medium"] }, then: 2 },
                        { case: { $eq: ["$difficulty", "Hard"] }, then: 3 }
                    ],
                    default: 4
                }
            }
        }
    };
};

router.get('/', async (req, res) => {
    try {
        const { search, difficulty, page = 1, limit = 50, sortBy } = req.query;
      
        const pipeline: any[] = [];

        pipeline.push({
            $lookup: {
                from: 'questions', 
                localField: 'questions',
                foreignField: '_id',
                as: 'questions',
                pipeline: [
                    ...(search || difficulty ? [{
                        $match: {
                            ...(search && { title: { $regex: search as string, $options: 'i' } }),
                            ...(difficulty && { difficulty: difficulty })
                        }
                    }] : []),
              
                    ...(sortBy ? (() => {
                        const [field, order] = (sortBy as string).split('_');
                        if (field === 'difficulty') {
                            return [
                                getDifficultySortStage(order ?? 'asc'), 
                                { $sort: { difficultySort: order === 'desc' ? -1 : 1, title: 1 } },
                                { $unset: "difficultySort" }
                            ];
                        } else if (field === 'name') {
                            return [{ $sort: { title: order === 'desc' ? -1 : 1 } }];
                        } else if (field) {
                            return [{ $sort: { [field]: order === 'desc' ? -1 : 1 } }];
                        }
                        return [];
                    })() : [{ $sort: { title: 1 } }])
                ]
            }
        });

        if (search || difficulty) {
            pipeline.push({
                $match: {
                    'questions.0': { $exists: true }
                }
            });
        }

        pipeline.push({
            $sort: { title: 1 }
        });

        const allCategories = await Category.aggregate(pipeline);

        const totalCategories = allCategories.length;
        const skip = (Number(page) - 1) * Number(limit);
        const paginatedCategories = allCategories.slice(skip, skip + Number(limit));

        const totalQuestions = allCategories.reduce((sum, category) => 
            sum + (category.questions ? category.questions.length : 0), 0
        );

        res.json({
            categories: paginatedCategories,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalCategories / Number(limit)),
                totalCategories,
                limit: Number(limit)
            },
            stats: {
                totalQuestions,
                totalFilteredCategories: totalCategories
            }
        });
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ 
            message: 'Server error', 
            error: process.env.NODE_ENV === 'development' ? err : 'Internal server error'
        });
    }
});

export default router;