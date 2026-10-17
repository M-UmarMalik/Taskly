import mongoose from "mongoose";

const { Schema } = mongoose;

const signupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    otpHash: {
        type: String,
        select: false,
    },
    otpExpiresAt: {
        type: Date,
        select: false,
    },
});

const signups = mongoose.model("signups", signupSchema);

export default signups;