import bcrypt from "bcrypt";
import serviceModel from "../model/serviceModel.js";
import jwt from "jsonwebtoken";
import { cookie } from "express-validator";
import { emailOtp } from "./mailController.js";
import verificationToken from "../model/verificationToken.js";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const createService = async (req, res, next) => {
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
    // confirmPassword,
  } = req.body;

  try {
    const userExists = await serviceModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const newUser = new serviceModel({
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
      // confirmPassword,
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
      to: newUser.email,
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

const servicelogin = async (req, res) => {
  const { email, password, token } = req.body;
  try {
    const user = await serviceModel.findOne({ email });
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
    res.status(200).json({
      message: `Welcome ${user.firstName} ${user.lastName}!`,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

const servicelogout = async (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out!" });
};
export { createService, servicelogin, servicelogout };
