import mongoose from "mongoose";

const pendingSignupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    otpExpiresAt: {
        type: Date,
        required: true,
    },
});

export default mongoose.model("PendingSignup", pendingSignupSchema);