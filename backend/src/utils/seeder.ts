import dotenv from 'dotenv'
import axios from 'axios'
import { connectDB } from '../config/db'
import Question from '../models/Question'
import Category from '../models/Category'

dotenv.config()

const seedData=async()=>{
    await connectDB();
    try{
        const res = await axios.get<{
            status:boolean;
            data: {title:String; ques: any[]}[];
        }>('https://test-data-gules.vercel.app/data.json');
        await Question.deleteMany({})
        await Category.deleteMany({})
        for(const categoryData of res.data.data){
            const questions=await Question.insertMany(
                categoryData.ques.map((q)=>({
                    title: q.title,
                    url: q.yt_link || q.p1_link || q.p2_link || '',
                    difficulty: 'Easy',
                }))
            );
            await Category.create({
                title: categoryData.title,
                questions: questions.map(q=>q._id)
            })
        }
        console.log('Database Seeded!');
        process.exit();
    }
    catch(err){
        console.error(err)
        process.exit(1)
    }
}

seedData();