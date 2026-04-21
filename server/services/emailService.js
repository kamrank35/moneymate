const nodemailer = require('nodemailer');

// Create transporter with Gmail or SMTP
const createTransporter = () => {
    const config = {
        host: process.env.email_host || 'smtp.gmail.com',
        port: parseInt(process.env.email_port) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.email_user,
            pass: process.env.email_password
        }
    };

    console.log('Email config:', {
        host: config.host,
        port: config.port,
        user: config.auth.user ? '***@***' : 'NOT_SET'
    });

    return nodemailer.createTransport(config);
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
    try {
        // Check if email config is set
        if (!process.env.email_user || !process.env.email_password) {
            console.warn('Email credentials not configured. OTP:', otp);
            return {
                success: false,
                error: 'Email service not configured. Please contact admin.'
            };
        }

        const transporter = createTransporter();

        // Verify transporter connection
        await transporter.verify();
        console.log('Email transporter verified successfully');

        const mailOptions = {
            from: `"MoneyMate" <${process.env.email_user}>`,
            to: email,
            subject: 'Your MoneyMate Password Change OTP',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 500px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #1a9f88 0%, #0d5f4d 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                        .header h1 { margin: 0; font-size: 24px; }
                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
                        .otp-box { background: white; border: 2px dashed #1a9f88; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #1a9f88; letter-spacing: 8px; }
                        .warning { background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 15px; border-radius: 8px; margin-top: 20px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 MoneyMate Security Verification</h1>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>We received a request to change your MoneyMate account password. Please use the following One-Time Password (OTP) to verify your identity:</p>

                            <div class="otp-box">
                                <div style="color: #666; margin-bottom: 10px; font-size: 14px;">Your OTP Code</div>
                                <div class="otp-code">${otp}</div>
                            </div>

                            <p><strong>This OTP is valid for 5 minutes only.</strong></p>
                            <p>If you did not request this password change, please ignore this email or contact our support team immediately.</p>

                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Our team will never ask for this code.
                            </div>

                            <div class="footer">
                                <p>© 2024 MoneyMate. All rights reserved.</p>
                                <p>This is an automated message, please do not reply.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent successfully to:', email, 'Message ID:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending OTP email:', error.message);
        console.error('Full error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendOTPEmail };
