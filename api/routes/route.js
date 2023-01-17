import { Router } from "express";
import {
  authenticate,
  login,
  registerUser,
} from "../controllers/authController.js";
import {
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
} from "../controllers/generateOtpController.js";
import { registerMail } from "../controllers/nodeMailerController.js";
import { getUser, updateUser } from "../controllers/userController.js";
import Authenticate, { localVariable } from "../middleware/authenticate.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = Router();

router.post("/register", registerUser);
router.post("/authenticate", verifyUser, authenticate);
router.post("/login", verifyUser, login);
router.post("/registerMail", registerMail);

router.get("/user/:username", getUser);
router.get("/generateOTP", verifyUser, localVariable, generateOTP);
router.get("/verifyOTP", verifyUser, verifyOTP);
router.get("/createResetSession", createResetSession);

router.put("/updateUser", Authenticate, updateUser);
router.put("/resetPassword", verifyUser, resetPassword);

export default router;
