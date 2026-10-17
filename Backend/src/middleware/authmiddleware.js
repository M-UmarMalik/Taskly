
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Authorization header se token lena
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please login first. Token is required.",
      });
    }

    const token = authHeader.split(" ")[1];

    // JWT token verify karna
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Logged-in user ki ID set karna
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token.",
      });
    }

    req.user = {
      id: userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;
