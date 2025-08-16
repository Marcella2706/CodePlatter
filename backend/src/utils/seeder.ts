import dotenv from 'dotenv'
import axios from 'axios'
import { connectDB } from '../config/db'
import Question from '../models/Question'
import Category from '../models/Category'

dotenv.config()

export const seedData = async () => {
    try {
        console.log('Starting data seeding...');
        
        const res = await axios.get<{
            status: boolean;
            data: { title: string; ques: any[] }[];
        }>('https://test-data-gules.vercel.app/data.json');

        if (!res.data.status) {
            throw new Error('API returned error status');
        }

        await Question.deleteMany({});
        await Category.deleteMany({});
        console.log('Cleared existing data');

        for (const categoryData of res.data.data) {
            console.log(`Processing category: ${categoryData.title}`);
            
            const validQuestions = categoryData.ques.filter(q => 
                q.title && q.title.trim() !== ''
            );
            
            if (validQuestions.length === 0) {
                console.log(`Skipping empty category: ${categoryData.title}`);
                continue;
            }

            const questions = await Question.insertMany(
                validQuestions.map((q) => {
                    const urls = [q.yt_link, q.p1_link, q.p2_link]
                        .filter(link => link && link.trim() !== '');
                    
                    return {
                        title: q.title.trim(),
                        url: urls,
                        difficulty: q.difficulty || 'Easy',
                    };
                })
            );

            await Category.create({
                title: categoryData.title.trim(),
                questions: questions.map(q => q._id)
            });

            console.log(`Created category "${categoryData.title}" with ${questions.length} questions`);
        }

        console.log('Database seeding completed successfully!');
    }
    catch (err) {
        console.error('Error during seeding:', err);
        throw err;
    }
}