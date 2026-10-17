import signups from "../models/user.js";
import PendingSignup from "../models/pendingSignup.js"
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const SignUp = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();

        // Check existing verified user
        const emailExist = await signups.findOne({
            email: normalizedEmail,
        });

        if (emailExist) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const usernameExist = await signups.findOne({
            username: normalizedUsername,
        });

        if (usernameExist) {
            return res.status(400).json({
                message: "Username already taken",
            });
        }

        // Check pending signup with this username
        const pendingUsername = await PendingSignup.findOne({
            username: normalizedUsername,
            email: { $ne: normalizedEmail },
        });

        if (pendingUsername) {
            return res.status(400).json({
                message: "Username already pending verification",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = crypto.randomInt(100000, 1000000).toString();

        const otpHash = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        // Remove previous pending signup for this email
        await PendingSignup.deleteOne({
            email: normalizedEmail,
        });

        // Save only in PendingSignup
        const pendingUser = await PendingSignup.create({
            name,
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword,
            otpHash,
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        // Send OTP email
        try {
            await sendEmail(normalizedEmail, otp);
        } catch (emailError) {
            await PendingSignup.deleteOne({
                _id: pendingUser._id,
            });

            console.error("OTP email error:", emailError.message);

            return res.status(500).json({
                message: "Unable to send verification email. Please try again.",
            });
        }

        return res.status(201).json({
            message: "OTP sent successfully. Please verify your email.",
            email: normalizedEmail,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email or username already exists",
            });
        }

        console.error("Signup error:", error.message);

        return res.status(500).json({
            message: "Registration failed",
        });
    }
};

export default SignUp;