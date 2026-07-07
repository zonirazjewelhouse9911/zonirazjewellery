const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Number,
    },
    auth_key: {
        type: String,
        default: null,
    },

    referrel_amount: {
        type: Number,
        default: 0,
    },

    notificationToken: {
        type: String,
        default: null,
    },

    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

const admin = mongoose.model("admin", adminSchema);
module.exports = admin;