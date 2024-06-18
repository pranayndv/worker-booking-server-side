import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import userModel from "../model/userRegistration.js";
import { isValidObjectId } from "mongoose";
import verificationToken from "../model/verificationToken.js";

const verifyEmail = async (req, res) => {
  const { userId, Otp } = req.body;
  if (!userId || !Otp.trim()) return res.status(401);
  if (!isValidObjectId(userId)) return res.status(401);
  const user = await userModel.findOne(userId);
  if (!user) return res.status(401);
  if (!user.verified) return res.status(400);
  const token = await verificationToken.findOne({ owner: user._id });
  if (!token) return res.status(400);
  const isMatched = await token.compareToken(Otp);
  if (!isMatched) return res.status(401);
  user.verified = true;
  await verificationToken.findByIdAndDelete(token._id);
  await user.save();
};

const emailOtp = () => {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp = otp + randVal;
  }
  return otp;
};

const mailTransport = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

const sendEmail = async (req, res) => {
  const { email } = req.body;

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
      name: "John Doe",
      intro: "verification mail from server",
      outro: "thank you",
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

  res.status(201).json("email sent successfully");
};

export { mailTransport, emailOtp, sendEmail };
