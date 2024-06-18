import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./model/userRegistration.js";
dotenv.config({
  path: "./env",
});
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 8080;

import { createUser, login } from "./controller/authController.js";

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(cookieParser());

dotenv.config();
//Mongodb connection
(async () =>
  mongoose
    .connect(`${process.env.MONGODB_URI}`)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err))
    .then(() =>
      app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    )
    .catch((err) => console.error(err)))();

// Import routes
import userRoutes from "./routes/authRoutes.js";

// routes
app.use("/api/user", userRoutes);

// app.get("/test/:id", async (req, res) => {
//   const id = req.params.id;
//   console.log(id);
//   const tes = await userModel.findById(id);
//   const firstName = tes.firstName;

//   res.json({ tes, firstName });
// });
