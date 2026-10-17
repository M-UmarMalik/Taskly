import express from "express";
import SignUp from "../controllers/signupController.js";
import Login from "../controllers/loginController.js";
import VerifyOTP from "../controllers/verifyOTP.js";

const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', Login);
router.post('/verify-otp', VerifyOTP)

export default router;