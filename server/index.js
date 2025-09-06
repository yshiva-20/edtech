import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay"
import { User } from "./models/user.js";

import userRoute from"./routes/user.js";
import courseRoute from"./routes/courses.js";
import adminRoute from"./routes/admin.js";
import TryCatch from "./middleware/tryCatch.js";
import { Courses } from "./models/courses.js";

dotenv.config();


export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID?.trim(),
  key_secret: process.env.RAZORPAY_KEY_SECRET?.trim(),
});

const app = express();


app.use(cors({
  origin: ["https://edtech-lbei.vercel.app"], 
  credentials: true
}));


app.use(express.json());

app.use("/api",userRoute);
app.use("/api",courseRoute);
app.use("/api",adminRoute);

app.use("/uploads",express.static("uploads"))

app.get("/", (req, res) => {
  res.send("Hello from the DOJ chatbot backend!");
});

app.listen(8080, () => {
  console.log("listening on port 8080");
  connectDb();
});


