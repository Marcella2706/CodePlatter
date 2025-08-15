import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import { seedData } from './utils/seeder';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

seedData();

app.use('/api/v1/auth', authRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, ()=>{
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
});
