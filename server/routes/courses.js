import express from "express";
import { getAllcourses, getSingleCourse,fetchLectures,fetchLecture, getMyCourses, checkout, paymentVerification } from "../controllers/course.js";
import { isAuth } from "../middleware/isAuth.js";

const router=express.Router();

router.get("/course/all",getAllcourses);

router.get("/course/:id",getSingleCourse);
router.get("/lectures/:id",isAuth,fetchLectures);
router.get("/lecture/:id",isAuth,fetchLecture);
router.get("/mycourse/",isAuth,getMyCourses);
router.post('/course/checkout/:id', isAuth, checkout);
router.post("/course/payment/verification/:id",isAuth,paymentVerification)
export default router;