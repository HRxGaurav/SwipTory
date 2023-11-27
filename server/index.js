import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import storyRoutes from './routes/storyRoutes.js';


const app = express()

dotenv.config();
const PORT = process.env.PORT;

//Cors policy
app.use(cors()); 

//Connect Database
connectDB();

//Load Routes
app.use(authRoutes)
app.use(storyRoutes)

//JSON
app.use(express.json()) 

app.listen(PORT, ()=>{
    console.log(`Server Running on port ${PORT}`);
})

