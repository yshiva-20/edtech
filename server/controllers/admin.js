import TryCatch from "../middleware/tryCatch.js";
import { Courses } from "../models/courses.js";
import { Lecture } from "../models/lecture.js";

import {rm} from "fs"

import { promisify } from "util";

import fs from "fs"
import { User } from "../models/user.js";




export const createCourse=TryCatch(async(req,res)=>{
    const {title, description,category,duration,createdBy,price}=req.body;
    const image=req.file;
await Courses.create({
    title, 
    description,
    category,
    duration,
    createdBy,
    price,
    image:image?.path,
});

res.status(201).json({
    message:"Course created sucessfully"
});

});





export const addLecture=TryCatch(async(req,res)=>{
    const course=await Courses.findById(req.params.id);


    if(!course)
        return res.status(404).json({
    message:"no course found with this id"
});

const {title,description}=req.body

const file=req.file

const lecture=await Lecture.create({
    
    title
    ,description,
    video:file?.path,
    course:course._id,

});

res.status(201).json({
    message:"created lec sucessfuly",
    lecture,
});

});






export const deleteLecture=TryCatch(async(req,res)=>{
    const lecture=await Lecture.findById(req.params.id);

    rm(lecture.video,()=>
    {
        console.log("video deleted sucessfully");
    });

await lecture.deleteOne();

res.json({
    message:"Lecture deleted"
});


});







const unlinkAsync=promisify(fs.unlink);








export const deleteCourse=TryCatch(async(req,res)=>{
    const course=await Courses.findById(req.params.id);
 const lectures=await Lecture.find({course:course._id});

    await Promise.all(
        lectures.map(async(lecture)=>{
            await unlikeAsync(lecture.video);
            console.log("video deleted")// jitni time print hoga jitni video hongi
        })
    );

      rm(lecture.image,()=>
    {
        console.log("course deleted sucessfully");
    });

    await Lecture.find({course:req.params.id}).deleteMany();
    await course.deleteOne();
    await User.updateMany({},{$pull:{subscription:req.params.id}});

    res.json({
        message:"course deleted",
    })

});


export const getAllStates = TryCatch(async (req, res) => {
  const totalLectures = await Lecture.countDocuments();
  const totalCourses = await Courses.countDocuments();
  const totalUsers = await User.countDocuments();

  const stats = {
    totalLectures,
    totalCourses,
    totalUsers,
  };

  res.status(200).json({ stats });
});


export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});




export const updateRole = TryCatch(async (req, res) => {
  if (req.user.mainrole !== "superadmin")
    return res.status(403).json({
      message: "This endpoint is assign to superadmin",
    });
  const user = await User.findById(req.params.id);

  if (user.role === "user") {
    user.role = "admin";
    await user.save();

    return res.status(200).json({
      message: "Role updated to admin",
    });
  }

  if (user.role === "admin") {
    user.role = "user";
    await user.save();

    return res.status(200).json({
      message: "Role updated",
    });
  }
});