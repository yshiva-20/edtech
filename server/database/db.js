import mongoose from "mongoose";


export const connectDb=async()=>{
    try{
await mongoose.connect(process.env.DB)
console.log("connected to db");
    }catch(err){
console.log(err);
    }
}