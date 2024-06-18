import bcrypt from "bcrypt";
import userModel from "../model/userRegistration.js";
import jwt from "jsonwebtoken";
import { cookie } from "express-validator";
import { emailOtp } from "./mailController.js";
import verificationToken from "../model/verificationToken.js";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

const createUser = async (req, res, next) => {
  const {
    firstName,
    middleName,
    lastName,
    DOB,
    country,
    state,
    city,
    tal,
    pincode,
    phoneNumber,
    email,
    password,
    confirmPassword,
  } = req.body;

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const newUser = new userModel({
      firstName,
      middleName,
      lastName,
      DOB,
      country,
      state,
      city,
      tal,
      pincode,
      phoneNumber,
      email,
      password,
      confirmPassword,
    }); //takes input from frontend and sends to backend
    const Otp = emailOtp();
    const newverificationToken = new verificationToken({
      owner: newUser._id,
      token: Otp,
    });
    await newverificationToken.save();
    await newUser.save();

    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };
    let transporter = nodemailer.createTransport(config);

    let mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
      },
    });
    let response = {
      body: {
        name: "Ares",
        intro: "verification mail from server",
        outro: "thank you",
        html: `<h1>Your OTP is ${Otp}</h1>`,
      },
    };

    let mail = mailGenerator.generate(response);

    let message = {
      from: process.env.EMAIL,
      to: "omgaonkar999@gmail.com",
      subject: "verification mail",
      html: mail,
    };
    transporter.sendMail(message).then(() => {
      console.log("email sent successfully");
      return res.status(201);
    });
    res.send(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password, token } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    //  Sign JWT token
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: age,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: age,
    });
    // res.status(200).json({
    //   message: `Welcome ${user.firstName} ${user.lastName}!`,
    //   token: token,
    //   user,
    // });
    res.json({
      data: user,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out!" });
};

const verifyEmail = async (req, res) => {
  const { userId, Otp } = req.body;
  if (!userId || !Otp.trim()) return res.status(401);
  if (!isValidObjectId(userId)) return res.status(401);
  const user = await userModel.findOne(userId);
  if (!user) return res.status(401);
  if (!user.isVerified) return res.status(400);
  const token = await verificationToken.findOne({ owner: user._id });
  if (!token) return res.status(400);
  const isMatched = await token.compareToken(Otp);
  if (!isMatched) return res.status(401);
  user.isVerified = true;
  await verificationToken.findByIdAndDelete(token._id);
  await user.save();
};

const loginProfile = async (req, res, next) => {
  const { email } = req.query;

  try {
    // Find the user in the database
    const userdata = await userModel.findAll({ email });
    console.log(userdata);
    // If user exists, send user data to the frontend
    if (userdata) {
      res.json(userdata.firstName);
      console.log("userdata", userdata);
      res.send(userdata);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export { createUser, login, logout, loginProfile };
