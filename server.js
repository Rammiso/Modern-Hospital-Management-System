const express=require('express');
const app=express();
const cors=require('cors');
const mysql=require('mysql2/promise');
const dotenv=require('dotenv');

dotenv.config();
app.use(cors());
app.use(express.json());



app.listen(process.env.port,()=>{
    console.log(`Server is running on port ${process.env.port}`);
})