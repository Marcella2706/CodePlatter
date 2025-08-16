import { Router } from "express";
import Category from "../models/Category";
import mongoose from "mongoose";

const router = Router();

// Helper function to build difficulty sort aggregation
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
        
        // Build aggregation pipeline for better performance with filtering and sorting
        const pipeline: any[] = [];

        // Step 1: Lookup questions and apply filters
        pipeline.push({
            $lookup: {
                from: 'questions', // Assuming your questions collection name
                localField: 'questions',
                foreignField: '_id',
                as: 'questions',
                pipeline: [
                    // Apply question filters
                    ...(search || difficulty ? [{
                        $match: {
                            ...(search && { title: { $regex: search as string, $options: 'i' } }),
                            ...(difficulty && { difficulty: difficulty })
                        }
                    }] : []),
                    
                    // Sort questions within each category
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

        // Step 2: Filter categories that have questions (when filters are applied)
        if (search || difficulty) {
            pipeline.push({
                $match: {
                    'questions.0': { $exists: true } // Only categories with at least one question
                }
            });
        }

        // Step 3: Sort categories
        pipeline.push({
            $sort: { title: 1 }
        });

        // Execute aggregation to get filtered categories
        const allCategories = await Category.aggregate(pipeline);

        // Apply pagination
        const totalCategories = allCategories.length;
        const skip = (Number(page) - 1) * Number(limit);
        const paginatedCategories = allCategories.slice(skip, skip + Number(limit));

        // Calculate statistics
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