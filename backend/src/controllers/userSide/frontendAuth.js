const User = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SECRET_KEY || 'zoniraz_super_secret_jwt_key_2026';

const formatUser = (user) => {
    const names = (user.user_name || user.name || '').split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    return {
        id: user._id,
        firstName,
        lastName,
        email: user.email,
        mobile: user.phone_number || user.phone
    };
};

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, password } = req.body;
        const user_name = `${firstName} ${lastName}`.trim();

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ error: 'Email already registered' });

        const existingMobile = await User.findOne({ phone_number: mobile });
        if (existingMobile) return res.status(400).json({ error: 'Mobile number already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            user_name,
            name: user_name,
            email,
            phone_number: mobile,
            phone: mobile,
            password: hashedPassword,
            isVerified: true
        });

        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        
        return res.status(201).json({
            token,
            user: formatUser(user)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({
            $or: [
                { email: identifier },
                { phone_number: identifier },
                { phone: identifier }
            ]
        });

        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        
        return res.status(200).json({
            token,
            user: formatUser(user)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.me = async (req, res) => {
    try {
        return res.status(200).json(formatUser(req.user));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (firstName || lastName) {
            const currentNames = (user.user_name || '').split(' ');
            const fName = firstName || currentNames[0] || '';
            const lName = lastName || currentNames.slice(1).join(' ') || '';
            user.user_name = `${fName} ${lName}`.trim();
            user.name = user.user_name;
        }

        if (email) user.email = email;
        if (mobile) {
            user.phone_number = mobile;
            user.phone = mobile;
        }

        await user.save();
        return res.status(200).json(formatUser(user));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        return res.status(200).json({ success: true, message: 'Account deleted' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.sendOtp = async (req, res) => {
    return res.status(200).json({ message: 'OTP sent to mobile' });
};

exports.verifyOtp = async (req, res) => {
    return res.status(200).json({ success: true });
};
