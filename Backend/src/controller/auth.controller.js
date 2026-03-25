import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Fix typo: "Alredy" → "Already"
    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User with this email or username already exists",
        success: false,
        error: "User already exists",
      });
    }

    const user = await userModel.create({ username, email, password });

    const emailVerification = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    // ✅ FIXED: Correct sendEmail call + text parameter
    const result = await sendEmail(
      email, // to
      "Welcome to Perplexity!", // subject
      `Hi ${username}, welcome aboard!`, // text (plain)
      `
                <div style="font-family: Arial;">
                    <h2>Welcome to Perplexity!</h2>
                    <p>Hi <strong>${username}</strong>,</p>
                    <p>Thank you for registering at <strong>Perplexity</strong>. 
                    We're excited to have you!</p>
                    <p>Please verify your email address by clicked to like below.</p>
                    <a href="http://localhost:8000/api/auth/verify-email?token=${emailVerification}">Verify email</a>
                    <p>Best regards,<br>The Perplexity Team</p>
                </div>
            `, // html
    );

    console.log("Email result:", result);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Server error for register user.",
      success: false,
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});

    if (!user) {
      return res.status(404).json({
        message: "User Not Existing Create a New User.",
        success: false,
        error: "User not existiong",
      });
    }

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) return res.status(400).json({
      message: "Invailed Email or Password",
      success: false,
      error: "Incorrect password"
    })

    if (!user.verified) return res.status(400).json({
      message: "Email Not Verify First To Verify Email.",
      success: false,
      error: "Email not verified"
    })

    const token = jwt.sign({
      id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token)

    res.status(200).json({
      message: "Login successful",
      success:true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })


  } catch (error) {
    console.error("Login User error:", error);
    return res.status(500).json({
      message: "Server error during login user.",
      success: false,
      error: error.message
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    let user;
    try {
      user = await userModel.findById(userId).select("-password")
      if(!user) return res.status(404).json({
        message: "User Not Founded!",
        success: false,
        error: "User not founded for get user info."
      })
      
    } catch (dberr) {
      console.error("Check User Info Database: ", error)
      return res.status(501).json({
        message: "Databse error get check user info.",
        success: false,
        error: dberr.message
      })
    }

    res.status(200).json({
      message: "User Details Featch Successfully.",
      success: true,
      user
    })
    

  } catch (error) {
    console.error("Get User Info error:", error);
    return res.status(500).json({
      message: "Server error during get user info.",
      success: false,
      error: error.message
    })
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        message: "Token not found in verification URL.",
        success: false,
        error: "Token missing."
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await userModel.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(404).json({
        message: "User with this email not found.",
        success: false,
        error: "Invalid user details."
      });
    }

    if (user.verified) {
      return res.status(200).json({
        message: "Email already verified.",
        success: true,
        error: null
      });
    }

    // Mark user as verified
    user.verified = true;
    await user.save();

    // Success response
    return res.redirect(`http://localhost:${process.env.FRONTEND_URL}/login?verified=true&message=success`);


  } catch (error) {
    console.error("Verify Email error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        message: "Invalid or expired verification token.",
        success: false,
        error: "Invalid token."
      });
    }
    
    res.status(500).json({
      message: "Server error during email verification.",
      success: false,
      error: error.message,
    });
  }
};
