import { Router } from "express";
import {
  createUser,
  login,
  logout,
  loginProfile,
} from "../controller/authController.js";
import { sendEmail } from "../controller/mailController.js";
// import { loginProfile } from "../controller/userController.js";
import {
  createService,
  servicelogin,
} from "../controller/serviceController.js";
const router = Router();

// POST Routes
router.route("/userregistrations").post(createUser);

router.route("/login").post(login);

router.route("/logout").post(logout);

router.route("/serviceregistrations").post(createService);

router.route("/sendEmail").post(sendEmail);

// GET Routes
router.route("/loginProfile").get(loginProfile);

router.route("/servicelogin").post(servicelogin);

export default router;
