import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendRegistrationMail, sendOTPMail } from "../services/email.service.js";
import { tokenBlacklistModel } from "../models/blacklist.model.js";

// Helper 1: Generate 6-digit OTP
function generate6DigitOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper 2: Hash OTP using SHA-256 for secure storage at rest
function hashOTP(otp) {
    return crypto.createHash("sha256").update(otp).digest("hex");
}

//User register controller
//Post /api/auth/register

async function userRegister(req, res) {
    const { email, password, name } = req.body;

    const ifExists = await User.findOne({
        email: email
    });

    if (ifExists) {
        return res.status(422).json({
            message: "User already exists with email",
            status: "Failed"
        })
    }

    const user = await User.create({
        email, password, name
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
    res.cookie("token", token);

    res.status(201).json({
        user: {
            id: user._id,
            email: user.email,
            name: user.name
        }, token
    });

    await sendRegistrationMail(user.email, user.name);
}

async function userLogin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne(
        { email }
    ).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "email or password is invalid"
        })
    }

    const isvalidPassword = await user.comparePassword(password);

    if (!isvalidPassword) {
        return res.status(401).json({
            message: "password is invalid"
        })
    }

    // 🔐 If 2FA is ENABLED: Do not issue JWT yet. Send OTP to email!
    if (user.is2FAEnabled) {
        const rawOTP = generate6DigitOTP();
        const hashedOTP = hashOTP(rawOTP);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        user.otpCode = hashedOTP; // Hashed at rest in MongoDB!
        user.otpExpiresAt = expiresAt;
        await user.save();

        await sendOTPMail(user.email, user.name, rawOTP);

        return res.status(200).json({
            require2FA: true,
            message: "2FA is enabled. Verification code sent to your email."
        });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
    res.cookie("token", token);

    res.status(200).json({
        user: {
            email: user.email,
            _id: user._id,
            name: user.name,
            is2FAEnabled: user.is2FAEnabled
        },
        token
    })

}

async function userLogout(req, res) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(400).json({
                message: "No token provided to logout"
            })
        }

        res.clearCookie("token")

        await tokenBlacklistModel.create({
            token: token
        }).catch(err => {
            if (err.code !== 11000) {
                throw err;
            }
        })

        res.status(200).json({
            message: "User logged Out successfully, token invalidated"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error logging out",
            error: error.message
        })
    }

}

async function sendOTP(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const rawOTP = generate6DigitOTP();
        const hashedOTP = hashOTP(rawOTP);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        user.otpCode = hashedOTP; // Hashed at rest in MongoDB!
        user.otpExpiresAt = expiresAt;
        await user.save();

        await sendOTPMail(user.email, user.name, rawOTP);

        return res.status(200).json({
            message: "2FA OTP verification code sent to your email"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error sending OTP email",
            error: error.message
        });
    }
}

async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email }).select("+otpCode +otpExpiresAt");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedInputOTP = hashOTP(otp);

        if (!user.otpCode || user.otpCode !== hashedInputOTP) {
            return res.status(400).json({ message: "Invalid OTP code" });
        }

        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({ message: "OTP has expired. Please request a new code." });
        }

        user.otpCode = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            message: "2FA Verification Successful",
            user: { _id: user._id, name: user.name, email: user.email, is2FAEnabled: user.is2FAEnabled },
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error verifying OTP",
            error: error.message
        });
    }
}

async function toggle2FA(req, res) {
    try {
        const user = await User.findById(req.user._id);
        user.is2FAEnabled = !user.is2FAEnabled;
        await user.save();

        return res.status(200).json({
            message: `2FA ${user.is2FAEnabled ? "ENABLED" : "DISABLED"} successfully`,
            is2FAEnabled: user.is2FAEnabled
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error toggling 2FA status",
            error: error.message
        });
    }
}

export { userRegister, userLogin, userLogout, sendOTP, verifyOTP, toggle2FA }