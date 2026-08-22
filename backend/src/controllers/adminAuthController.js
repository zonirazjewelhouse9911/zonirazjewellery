const Admin = require('../models/adminModel');
const BlogAccess = require('../models/blogAccessModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const SECRET_KEY = process.env.SECRET_KEY || 'zoniraz_admin_secret_key_9911';

// Configure Nodemailer for Email Verification
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'vikasjangid3352@gmail.com',
    pass: 'wtqe znhi gtmv oyfa',
  },
});

// Helper to send email OTP
const sendEmailOTP = async (email, otp) => {
  const mailOptions = {
    from: '"Zoniraz Jewels Admin" <vikasjangid3352@gmail.com>',
    to: email,
    subject: '🔒 Zoniraz Admin - Password Reset Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f7f4f2; padding: 30px; color: #12100e;">
        <div style="max-w-md: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #e2d7d2;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-family: Georgia, serif; color: #5d463c; margin: 0;">ZONIRAZ JEWELS</h2>
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #a88265; font-weight: bold; margin-top: 4px;">Admin Portal Verification</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #f0e6e2; margin: 20px 0;" />
          <p style="font-size: 14px; color: #4a4a4a;">Hello Admin,</p>
          <p style="font-size: 14px; color: #4a4a4a; line-height: 1.5;">You requested a password reset for your Zoniraz Admin account. Please use the following 6-digit verification code:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #5d463c; background: #f5ebe2; padding: 12px 24px; border-radius: 12px; display: inline-block; border: 1px dashed #c5a880;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 12px; color: #888888; text-align: center;">This verification code expires in 15 minutes. If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// 1. Admin Login Endpoint
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // Check if main admin exists in database
    let admin = await Admin.findOne({ email: trimmedEmail });
    if (!admin) {
      // Check if this matches a Blog Writer Access account!
      const writer = await BlogAccess.findOne({
        $or: [{ email: trimmedEmail }, { username: trimmedEmail }],
        isActive: true
      });

      if (writer) {
        const isMatch = await bcrypt.compare(password, writer.password);
        if (isMatch) {
          const token = jwt.sign(
            { userId: writer._id, email: writer.email, role: 'blog_writer' },
            SECRET_KEY,
            { expiresIn: '7d' }
          );
          return res.status(200).json({
            success: true,
            message: 'Blog Writer authentication successful',
            token,
            admin: {
              id: writer._id,
              email: writer.email,
              username: writer.username,
              name: writer.name,
              role: 'blog_writer'
            }
          });
        }
      }

      const count = await Admin.countDocuments();
      if (count === 0 && trimmedEmail === 'admin@zoniraz.com') {
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = await Admin.create({
          email: 'admin@zoniraz.com',
          password: hashedPassword
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }


    // Compare Password (supports hashed or direct plain password during seed)
    let isMatch = false;
    if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, admin.password);
    } else {
      isMatch = (admin.password === password);
      // Auto-upgrade to bcrypt hash on first successful login
      if (isMatch) {
        admin.password = await bcrypt.hash(password, 10);
        await admin.save();
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT Auth Token
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: 'admin' },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    admin.auth_key = token;
    admin.updated_at = Date.now();
    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        created_at: admin.created_at
      }
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication' });
  }
};

// 2. Forgot Password - Send Email Verification OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Admin email address is required' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: trimmedEmail });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'No registered admin found with this email' });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 Minutes Expiry

    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    // Dispatch Verification Email
    try {
      await sendEmailOTP(trimmedEmail, otp);
      console.log(`[Admin Forgot Password]: OTP ${otp} sent via email to ${trimmedEmail}`);
    } catch (emailErr) {
      console.error('Failed to send verification email, logging OTP to server console:', emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Verification code dispatched to ${trimmedEmail}`
    });

  } catch (error) {
    console.error('Admin Forgot Password Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during password reset request' });
  }
};

// 3. Verify Email OTP Code
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: trimmedEmail });

    if (!admin || admin.otp !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid or incorrect verification code' });
    }

    if (Date.now() > admin.otpExpiry) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You may now reset your password.'
    });

  } catch (error) {
    console.error('Admin Verify OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during OTP verification' });
  }
};

// 4. Reset Password Endpoint
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: trimmedEmail });

    if (!admin || admin.otp !== String(otp).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification session' });
    }

    if (Date.now() > admin.otpExpiry) {
      return res.status(400).json({ success: false, message: 'Verification code has expired' });
    }

    // Hash new password and update admin account
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.otp = null;
    admin.otpExpiry = null;
    admin.updated_at = Date.now();
    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Admin password updated successfully. You can now log in with your new credentials.'
    });

  } catch (error) {
    console.error('Admin Reset Password Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during password update' });
  }
};

// 5. Get Current Logged In Admin Details
exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const admin = await Admin.findById(decoded.adminId).select('-password -otp -otpExpiry');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin account not found' });
    }

    return res.status(200).json({
      success: true,
      admin
    });

  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
};
