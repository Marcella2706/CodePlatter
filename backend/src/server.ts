import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.post('/test', (req, res) => {
    console.log('POST received!');
    res.send('heloooo');
  });
  
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, ()=>{
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
});
