/**
 * Test Email Script for MoneyMate OTP
 *
 * This script tests if your email configuration is working correctly.
 *
 * Usage:
 * 1. Update the .env file with your real email credentials
 * 2. Run: node test-email.js your-email@example.com
 *
 * For Gmail:
 * - Enable 2-Factor Authentication first
 * - Go to: https://myaccount.google.com/apppasswords
 * - Generate an app password for "Mail"
 * - Use that 16-character password (not your regular password)
 */

require('dotenv').config({ path: '../../.env' });
const { sendOTPEmail } = require('./services/emailService');

const testEmail = process.argv[2];

if (!testEmail) {
    console.error('❌ Please provide a test email address');
    console.error('Usage: node test-email.js your-email@example.com');
    process.exit(1);
}

if (!process.env.email_user || !process.env.email_password) {
    console.error('❌ Email credentials not configured in .env file');
    console.error('');
    console.error('Please update your .env file with:');
    console.error('  email_user = your-email@gmail.com');
    console.error('  email_password = your-app-password');
    console.error('');
    console.error('For Gmail, get an App Password from:');
    console.error('https://myaccount.google.com/apppasswords');
    process.exit(1);
}

const testOTP = Math.floor(100000 + Math.random() * 900000).toString();

console.log('📧 Sending test OTP email to:', testEmail);
console.log('🔢 Test OTP:', testOTP);
console.log('');

sendOTPEmail(testEmail, testOTP)
    .then(result => {
        if (result.success) {
            console.log('✅ Test email sent successfully!');
            console.log('Message ID:', result.messageId);
            console.log('');
            console.log('Check your inbox (and spam folder) for the OTP email.');
        } else {
            console.log('❌ Failed to send test email');
            console.log('Error:', result.error);
            console.log('');
            console.log('Troubleshooting tips:');
            console.log('1. Check if email credentials are correct');
            console.log('2. For Gmail: Use App Password, not regular password');
            console.log('3. Check if "Less secure app access" is enabled (if not using 2FA)');
            console.log('4. Check your firewall/network settings');
        }
    })
    .catch(error => {
        console.error('❌ Unexpected error:', error.message);
        console.error(error);
    });
