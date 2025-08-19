import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import { seedData } from './utils/seeder';
import contentRoutes from './routes/contentRoutes';
import userRoutes from './routes/userRoutes';
import contactRoutes from './routes/contactRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/user', userRoutes);
app.use("/api/v1/contact", contactRoutes);

app.get('/', (req, res) => {
  res.send('Server is working!');
}); 

connectDB().then(async() => {
  await seedData();
  app.listen(process.env.PORT || 5703, ()=>{
    console.log(`Server running on port ${process.env.PORT || 5703}`);
  });
});
