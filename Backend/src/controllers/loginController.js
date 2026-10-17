import signups from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
            });
        };

        const user = await signups.findOne({
            email: email.trim().toLowerCase()
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: "Invalid Email or password"
            });
        };

        const isMatch = await bcrypt.compare(password, user.password);

        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        };

        if(!process.env.JWT_SECRET){
            throw new Error("JWT is missing");
        };

        const token = jwt.sign(
            {id: String(user._id)},
            process.env.JWT_SECRET,
            { expiresIn: "1d"}
        );

         return res.status(200).json({
      message: "User login successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });

    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ message: "Login failed"});
    }
};

export default Login;