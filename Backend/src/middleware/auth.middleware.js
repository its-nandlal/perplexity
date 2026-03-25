import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js"; // Fixed: Added .js extension

export async function authUser(req, res, next) {
  try {
    // Check if token exists in cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access. Please login first.",
        success: false,
        error: "No authentication token provided",
      });
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid authentication token.",
          success: false,
          error: "Invalid token format or signature",
        });
      }
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Please login again.",
          success: false,
          error: "Token has expired",
        });
      }
      throw jwtError; // Re-throw unexpected JWT errors
    }

    // Find user by email
    const user = await userModel.findOne({ email: decodedToken.email }).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again.",
        success: false,
        error: "User associated with this token no longer exists",
      });
    }

    if (!user.verified) {
      // Optional: Check if email is verified
      return res.status(403).json({
        message: "Please verify your email before accessing this resource.",
        success: false,
        error: "Email not verified",
      });
    }

    // Attach user to request object
    req.user = user;

    // Optional: Attach token info if needed
    req.token = token;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error("Authorization Middleware Error:", error);

    // Differentiate between database and other errors
    if (error.name === "MongoNetworkError") {
      return res.status(503).json({
        message: "Database connection error. Please try again later.",
        success: false,
        error: "Service temporarily unavailable",
      });
    }

    return res.status(500).json({
      message: "Internal server error during authentication.",
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Authentication failed",
    });
  }
}
