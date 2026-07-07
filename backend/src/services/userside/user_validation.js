const user_model = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "vikasjangid3352@gmail.com",
        pass: "wtqe znhi gtmv oyfa",
    },
});

const sendOTP = (email, otp) => {
    const mailOptions = {
        from: "vikasjangid3352@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
    };

    return transporter.sendMail(mailOptions);
};

exports.register = async (req, res) => {
    const { user_name, email, password, phone_number } = req.body;
    console.log(req.body);
    
    let patient = "";
    try {
        const existingUser = await user_model.findOne({
            $or: [
                { email: email },
                { phone_number: phone_number }
            ]
        });
        if (existingUser && existingUser.isVerified == true) {
            return {
                message: "User already exists",
                success: false,
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiry = Date.now() + 3600000; // 1 hour
        if (existingUser) {
            const delet_user = await user_model.deleteMany({ email });
            const newUser = new user_model({
                user_name,
                email,
                password: hashedPassword,
                phone_number:phone_number,
                otp,
                otpExpiry,
            });
            patient = await newUser.save();
        } else {
            const newUser = new user_model({
                user_name,
                email,
                password: hashedPassword,
                phone_number:phone_number,
                otp,
                otpExpiry,
            });
            patient = await newUser.save();
        }

        const otp_send = await sendOTP(email, otp);

        if (patient || otp_send) {
            return {
                message: "OTP send successfully",
                success: true,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            message: error,
            success: false,
        };
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(typeof otp);
    try {
        const user = await user_model.findOne({ email });
        if (!user) {
            return {
                message: "Invalid email",
                success: false,
            };
        }
        console.log(typeof user.otp);
        if (user.otp !== otp || otp == undefined || user.otpExpiry < Date.now()) {
            return {
                message: "Invalid or expired OTP",
                success: false,
            };
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        if (!token) {
            return {
                message: "Token generation failed",
                success: false,
            };
        }
        res.cookie("token", token);
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.auth_key = token;
        const authKeyInsertion = await user.save();

        if (!authKeyInsertion) {
            return {
                message: "Token updation failed",
                success: false,
            };
        }
        return {
            token,
            message: "patient register successfully",
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            message: error,
            success: false,
        };
    }
};

exports.user_login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user_model.findOne({ email });
        if (!existingUser) {
            return {
                success: false,
                message: "Invalid email or not registered!",
            };
        }
        if (existingUser.isVerified == false) {
            return {
                success: false,
                message: "complete your validation phase",
            };
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordValid) {
            return res.status(403).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);
        if (!token) {
            return res.json({ message: " Token generation failed" });
        }
        // Set the token to cookies
        res.cookie("token", token);
        const authKeyInsertion = await user_model.findOneAndUpdate(
            { _id: existingUser._id },
            { auth_key: token },
            { new: true }
        );

        if (!authKeyInsertion) {
            return res.json({ message: "Token updation failed" });
        }

        return {
            message: "User logged in successfully",
            success: true,
            token: token,
            userId: existingUser._id
        };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
};
exports.userID = async (req, res) => {
    try {
        let user_id = req.user._id;
        console.log(user_id);

        const { userID } = req.body;
        if (!user_id || !userID) {
            return res.status(400).json({ message: "Email and user_name are required" });
        }
        const updatedUser = await user_model.findOneAndUpdate(
            { _id: user_id },                // find by email (can use _id too)
            { user_name: userID },         // update only user_name
            { new: true }                     // return updated document
        );

        if (!updatedUser) {
            return res.json({ message: " userID generation failed" });
        }
        return {
            message: "userID generation successfully",
            success: true,
            user: updatedUser
        };

    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
};
