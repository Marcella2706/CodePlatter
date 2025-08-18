import { Router } from "express";
import rateLimit from 'express-rate-limit';
import Category from "../models/Category";

const router = Router();

// Rate limiting for search/filter requests
const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // limit each IP to 60 requests per windowMs
    message: 'Too many search requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const getDifficultySortStage = (order: string) => {
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

router.get('/', searchLimiter, async (req, res) => {
    try {
        const { 
            search, 
            difficulty, 
            page = 1, 
            limit = 10, 
            sortBy 
        } = req.query;

        // Validate and sanitize input
        const currentPage = Math.max(1, parseInt(page as string) || 1);
        const itemsPerPage = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
        const searchTerm = search ? (search as string).trim() : '';
        const difficultyFilter = difficulty ? (difficulty as string).trim() : '';

        console.log('Content API called with params:', {
            search: searchTerm,
            difficulty: difficultyFilter,
            page: currentPage,
            limit: itemsPerPage,
            sortBy
        });

        const pipeline: any[] = [];

        // First, lookup questions with optional filtering
        pipeline.push({
            $lookup: {
                from: 'questions', 
                localField: 'questions',
                foreignField: '_id',
                as: 'questions',
                pipeline: [
                    // Apply question filters if provided
                    ...(searchTerm || difficultyFilter ? [{
                        $match: {
                            ...(searchTerm && { 
                                title: { 
                                    $regex: searchTerm, 
                                    $options: 'i' 
                                } 
                            }),
                            ...(difficultyFilter && { 
                                difficulty: difficultyFilter 
                            })
                        }
                    }] : []),
              
                    // Apply sorting to questions
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

        // Filter out categories with no questions (if search/difficulty filters applied)
        if (searchTerm || difficultyFilter) {
            pipeline.push({
                $match: {
                    'questions.0': { $exists: true }
                }
            });
        }

        // Add category sorting
        pipeline.push({
            $sort: { title: 1 }
        });

        // Add fields for pagination
        pipeline.push({
            $addFields: {
                questionCount: { $size: "$questions" },
                totalQuestions: { $sum: { $size: "$questions" } }
            }
        });

        // Execute pipeline to get all matching categories
        const allCategories = await Category.aggregate(pipeline);

        // Calculate statistics
        const totalCategories = allCategories.length;
        const totalQuestions = allCategories.reduce((sum, category) => 
            sum + (category.questions ? category.questions.length : 0), 0
        );

        // Apply pagination
        const skip = (currentPage - 1) * itemsPerPage;
        const paginatedCategories = allCategories.slice(skip, skip + itemsPerPage);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCategories / itemsPerPage);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        const response = {
            success: true,
            categories: paginatedCategories,
            pagination: {
                currentPage,
                totalPages,
                totalCategories,
                limit: itemsPerPage,
                hasNextPage,
                hasPrevPage,
                nextPage: hasNextPage ? currentPage + 1 : null,
                prevPage: hasPrevPage ? currentPage - 1 : null
            },
            stats: {
                totalQuestions,
                totalFilteredCategories: totalCategories,
                categoriesOnPage: paginatedCategories.length,
                questionsOnPage: paginatedCategories.reduce((sum, cat) => 
                    sum + (cat.questions ? cat.questions.length : 0), 0
                )
            },
            filters: {
                search: searchTerm || null,
                difficulty: difficultyFilter || null,
                sortBy: sortBy || null
            },
            meta: {
                timestamp: new Date().toISOString(),
                processingTime: process.hrtime()[0]
            }
        };

        console.log('Sending response:', {
            categoriesCount: response.categories.length,
            pagination: response.pagination,
            stats: response.stats
        });

        res.json(response);

    } catch (err) {
        console.error('Error fetching categories:', err);
        
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching content', 
            error: process.env.NODE_ENV === 'development' ? {
                message: err instanceof Error ? err.message : 'Unknown error',
                stack: err instanceof Error ? err.stack : undefined
            } : 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
    });
});

// Statistics endpoint
router.get('/stats', async (req, res) => {
    try {
        const totalCategories = await Category.countDocuments();
        const categoriesWithQuestions = await Category.aggregate([
            {
                $lookup: {
                    from: 'questions',
                    localField: 'questions',
                    foreignField: '_id',
                    as: 'questionDetails'
                }
            },
            {
                $addFields: {
                    questionCount: { $size: '$questionDetails' },
                    difficulties: {
                        $reduce: {
                            input: '$questionDetails',
                            initialValue: { Easy: 0, Medium: 0, Hard: 0 },
                            in: {
                                Easy: {
                                    $cond: [
                                        { $eq: ['$$this.difficulty', 'Easy'] },
                                        { $add: ['$$value.Easy', 1] },
                                        '$$value.Easy'
                                    ]
                                },
                                Medium: {
                                    $cond: [
                                        { $eq: ['$$this.difficulty', 'Medium'] },
                                        { $add: ['$$value.Medium', 1] },
                                        '$$value.Medium'
                                    ]
                                },
                                Hard: {
                                    $cond: [
                                        { $eq: ['$$this.difficulty', 'Hard'] },
                                        { $add: ['$$value.Hard', 1] },
                                        '$$value.Hard'
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalQuestions: { $sum: '$questionCount' },
                    totalEasy: { $sum: '$difficulties.Easy' },
                    totalMedium: { $sum: '$difficulties.Medium' },
                    totalHard: { $sum: '$difficulties.Hard' },
                    avgQuestionsPerCategory: { $avg: '$questionCount' },
                    categoriesWithQuestions: {
                        $sum: {
                            $cond: [{ $gt: ['$questionCount', 0] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const stats = categoriesWithQuestions[0] || {
            totalQuestions: 0,
            totalEasy: 0,
            totalMedium: 0,
            totalHard: 0,
            avgQuestionsPerCategory: 0,
            categoriesWithQuestions: 0
        };

        res.json({
            success: true,
            stats: {
                totalCategories,
                categoriesWithQuestions: stats.categoriesWithQuestions,
                totalQuestions: stats.totalQuestions,
                questionsByDifficulty: {
                    Easy: stats.totalEasy,
                    Medium: stats.totalMedium,
                    Hard: stats.totalHard
                },
                avgQuestionsPerCategory: Math.round(stats.avgQuestionsPerCategory * 100) / 100
            },
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching statistics',
            timestamp: new Date().toISOString()
        });
    }
});

export default router;