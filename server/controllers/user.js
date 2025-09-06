
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";
import TryCatch from "../middleware/tryCatch.js";



export const register=async(req,res)=>{
    try {
        const {email, name, password}=req.body;

        let user = await User.findOne({ email });


 if(user)
return res.status(400).json({
        message:"user already exist",
    });

 const hashPassword=await bcrypt.hash(password,10)


 user={
    name,
    email,
    password:hashPassword,
}

const otp=Math.floor(Math.random()*1000000);



const activationToken= jwt.sign(
    {
    user,
    otp
},

process.env.Activation_secret,{
    expiresIn:"5m",
}
); 



const data={
    name,
    otp,
};
    

await sendMail(
    email,
    "S elearning",
    data
)

res.status(200).json({
    message:"otp send to your mail",
    activationToken,
})

} 


catch (error) {
        res.status(500).json({
            message:error.message,
        });
    }
};







export const verifyUser=TryCatch(async(req,res)=>{
const{otp,activationToken}=req.body;


const verify=jwt.verify(activationToken,process.env.Activation_secret);
if(!verify)
    return res.status(400).json({
message:"otp Expired",
});

if(verify.otp!==otp) return res.status(400).json({
    message:"wrong otp",
    });
 await User.create({
    name:verify.user.name,
    email:verify.user.email,
    password:verify.user.password,
 })
res.json({
    message:"register sucessful",
})
});
    


export const loginUser=TryCatch(async(req,res)=>
    {
    const{email,password}=req.body;

    const user=await User.findOne({email});
    if(!user)
        return res.status(400).json({
    message:"no user with this mail please register",
});


const matchPassword=await bcrypt.compare(password,user.password);
if(!matchPassword)
    return res.status(400).json({
message:"wrong password",
});

const token = jwt.sign(
    { _id: user._id },
    process.env.Jwt_Sec,
    { expiresIn: "15d" }
  );

res.json({
    message:`Welcome back ${user.name}`,
    token,
    user,
})

});


export const myProfile=TryCatch(async(req,res)=>
{
const user=await User.findById(req.user._id);
res.json({user});
});