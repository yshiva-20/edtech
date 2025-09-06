import { instance } from "../index.js";
import TryCatch from "../middleware/tryCatch.js";
import { Courses } from "../models/courses.js";
import { Lecture } from "../models/lecture.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/user.js";
import crypto from "crypto"

export const getAllcourses=TryCatch(async(req,res)=>{
    const courses=await Courses.find();
    res.json({
        courses,
    })
});


export const getSingleCourse=TryCatch(async(req,res)=>{
    const course=await Courses.findById(req.params.id);
    res.json({
        course,
    })
});


export const fetchLectures=TryCatch(async(req,res)=>{
    const lectures=await Lecture.find({course:req.params.id});//  finds all lectures for course 123
    const user= await User.findById(req.user._id);

if(user.role === "admin"){
    return res.json({lectures});
}

if(!user.subscription.includes(req.params.id)) return res.status(400).json({
    message:"you have not subscribed this course "
});

res.json({lectures});


});

export const fetchLecture=TryCatch(async(req,res)=>{
    const lecture=await Lecture.findById(req.params.id);
    const user= await User.findById(req.user._id);

if(user.role === "admin"){
    return res.json({lecture});
}

if(!user.subscription.includes(lecture.course)) return res.status(400).json({
    message:"you have not subscribed this course "
});

res.json({lecture});


});



export const getMyCourses=TryCatch(async(req,res)=>{
    const courses=await Courses.find({_id:req.user.subscription});

    res.json({courses});
});












// controllers/paymentController.js (or courseController.js)
import Razorpay from "razorpay";

export const checkout = async (req, res) => {
  try {
    console.log("🔍 CHECKOUT FUNCTION CALLED");

    // Check user & course existence first (already in your code)

    // ✅ Initialize Razorpay properly
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,        // must be in .env
      key_secret: process.env.RAZORPAY_KEY_SECRET // must be in .env
    });

    const courseId = req.params.id;
    const course = await Courses.findById(courseId); // assuming you did this already

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ amount should always be integer (paise)
    const options = {
      amount: course.price * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    console.log("Creating order with:", options);

    const order = await razorpay.orders.create(options);

    console.log("✅ Order created:", order);

    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ CHECKOUT ERROR:", error);
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
};















export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log("📩 Verification request:", req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("🔑 Expected:", expectedSignature);
    console.log("🔑 Received:", razorpay_signature);

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed (invalid signature)",
      });
    }

    // ✅ Save payment record
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    // ✅ Add course to user
    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);

    if (!user || !course) {
      return res.status(404).json({
        success: false,
        message: "User or Course not found",
      });
    }

    if (!user.subscription.includes(course._id)) {
      user.subscription.push(course._id);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Course Purchased Successfully",
    });
  } catch (error) {
    console.error("❌ Payment verification server error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};