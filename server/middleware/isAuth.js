import jwt from "jsonwebtoken";
import {User} from "../models/user.js";

export const isAuth=async(req,res,next)=>{
    try {
const token=req.headers.token;//This line grabs the JWT token that the client/user sent in the request headers and stores it in a variable so you can use it to decode or verify who the user is.

if(!token)
    return res.status(403).json({
            message:"please Login "
    });
    
    const decodeData=jwt.verify(token,process.env.Jwt_Sec);
    
    req.user=await User.findById(decodeData._id);
next();


    } catch (error) {
        res.status(500).json({
            message:"Login first"
        })
        
    }
};



export const isAdmin=(req,res,next)=>{
    try {
        if(req.user.role!=="admin")
            return res.status(403).json({
                message:" you are not admin"
        });
        next();
        
    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}