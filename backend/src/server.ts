import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { connectDB } from './config/db'
import router from './routes/index'

dotenv.config()

const app=express()
app.use(cors)
app.use(express.json())

app.use('/api/v1', router);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
