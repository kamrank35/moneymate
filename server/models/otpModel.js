const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        enum: ['password_change', 'email_verification', 'phone_verification']
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // MongoDB will auto-delete expired documents
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OTP', otpSchema);
