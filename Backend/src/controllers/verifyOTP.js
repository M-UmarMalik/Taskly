import signups from "../models/user.js";
import PendingSignup from "../models/pendingSignup.js";
import crypto from "crypto";

const VerifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;

        // Check required fields
        if (!otp) {
            return res.status(400).json({
                message: "OTP is required"
            });
        }

        // Hash entered OTP
        const enteredOtpHash = crypto
            .createHash("sha256")
            .update(String(otp))
            .digest("hex");

        // Find pending signup directly using the hashed OTP
        const pendingUser = await PendingSignup.findOne({
            otpHash: enteredOtpHash
        });

        if (!pendingUser) {
            return res.status(400).json({
                message: "Invalid or expired OTP. Please sign up again."
            });
        }

        // Check OTP expiration
        if (pendingUser.otpExpiresAt < new Date()) {
            await PendingSignup.deleteOne({ _id: pendingUser._id });

            return res.status(400).json({
                message: "OTP has expired. Please sign up again."
            });
        }

        const normalizedEmail = pendingUser.email.trim().toLowerCase();

        // Check duplicate email
        const emailExists = await signups.findOne({
            email: normalizedEmail
        });

        if (emailExists) {
            await PendingSignup.deleteOne({ _id: pendingUser._id });

            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Check duplicate username
        const usernameExists = await signups.findOne({
            username: pendingUser.username
        });

        if (usernameExists) {
            await PendingSignup.deleteOne({ _id: pendingUser._id });

            return res.status(400).json({
                message: "Username already taken"
            });
        }

        // Create actual user after OTP verification
        await signups.create({
            name: pendingUser.name,
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password,
            isEmailVerified: true
        });

        // Delete pending signup
        await PendingSignup.deleteOne({
            _id: pendingUser._id
        });

        return res.status(200).json({
            message: "Email verified successfully. Your account has been created."
        });

    } catch (error) {
        console.error("OTP verification error:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email or username already exists"
            });
        }

        return res.status(500).json({
            message: "OTP verification failed"
        });
    }
};

export default VerifyOTP;