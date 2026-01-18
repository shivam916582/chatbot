import express from 'express';
import routes from './routes/chatbot.route.js';
import cors from 'cors';
const app=express();
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
app.use(express.json());
app.use(cors());
const port=process.env.PORT || 3000;
//database connection code
mongoose.set("autoIndex", false);
const uri=process.env.mongo_uri;
try{
    mongoose.connect(uri);
    console.log("database connected");
}
catch(error){
    console.log("error connecting to mongodb",error);
}
app.use("/bot/v1",routes);
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})
