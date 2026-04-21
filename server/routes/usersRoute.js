const router = require('express').Router();
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const OTP = require('../models/otpModel');
const { v4: uuidv4 } = require('uuidv4');


// register user account

router.post('/register',async (req,res) => {
    try {
        // check if user alredy exist

        let user = await User.findOne({email: req.body.email})
        if(user){
            return res.send({
                success:false,
                message:"User already exists "
            
            })
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        req.body.password = hashedPassword
        const newUser = new User(req.body)
        await newUser.save()
        res.send({
            message: "User created succesfully!",
            data:null,
            success:true,
        })

    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})


// login user account 
router.post('/login',async (req,res) => {
    try {
        //check if user exists

        let user = await User.findOne({email: req.body.email})
        if(!user){
            return res.send({
                success:false,
                message:"User does not exists "
            
            })
        }

        // check if password is correct

        const validPassword = await bcrypt.compare(req.body.password, user.password) 

        if(!validPassword){
            return res.send({
                success:false,
                message:"Invalid password"
            
            })
        }

        // generate token
        const token = jwt.sign({userId:user._id},process.env.jwt_secret, {expiresIn : '1d'})
        res.send({
            message:"User logged in succesfully",
            data:token,
            success:true,   
        })
        
    } catch (error) {
        res.send({
            message:error.message,
            success:true,   
        })
    }
})


// get user info

router.post('/get-user-info', authMiddleware, async(req,res) => {
    try {
        const user = await User.findById(req.body.userId);
        user.password=''
        res.send({
            message: "User info fetched successfully",
            data:user,
            success:true,
        })
    } catch (error) {
        res.send({
            message:error.message,
            success:false,
        })
    }
})


// get all users
router.post('/get-all-users',authMiddleware,async(req,res) => {
    try {
        const users = await User.find();
        res.send({
            message: "Users fetched successfully",
            data:users,
            success:true,
        })
    } catch (error) {
        res.send({
            message:error.message,
            success:false,
        })
    }
})

// search users by name, email, or phone
router.post('/search-users', authMiddleware, async(req,res) => {
    try {
        const { query } = req.body;
        if(!query || query.length < 2){
            return res.send({
                message: "Search query must be at least 2 characters",
                data: [],
                success: false
            })
        }

        const users = await User.find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phoneNumber: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.body.userId } // exclude current user
        }).select('_id firstName lastName email phoneNumber');

        res.send({
            message: "Users found",
            data: users,
            success: true
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})

// update user profile
router.post('/update-profile', authMiddleware, async(req,res) => {
    try {
        const { userId } = req.body;
        const { firstName, lastName, phoneNumber, identificationType, identificationNumber, address } = req.body;

        // Users can only update their own profile
        if (userId !== req.body.userId) {
            return res.send({
                success: false,
                message: "You can only update your own profile"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                phoneNumber,
                identificationType,
                identificationNumber,
                address
            },
            { new: true }
        );

        updatedUser.password = '';

        res.send({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
})

// send OTP for password change
router.post('/send-otp', authMiddleware, async(req,res) => {
    try {
        const { userId } = req.body;

        // Users can only request OTP for themselves
        if (userId !== req.body.userId) {
            return res.send({
                success: false,
                message: "You can only request OTP for your own account"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.send({
                success: false,
                message: "User not found"
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTPs for this user and purpose
        await OTP.deleteMany({ userId, purpose: 'password_change' });

        // Create new OTP (expires in 5 minutes)
        const newOTP = new OTP({
            userId,
            otp,
            purpose: 'password_change',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        });

        await newOTP.save();

        // In production, send OTP via email/SMS here
        // For now, return OTP in response (remove in production)
        res.send({
            success: true,
            message: "OTP sent successfully",
            otp: otp // Remove this in production - only for testing
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

// verify OTP for password change
router.post('/verify-otp', authMiddleware, async(req,res) => {
    try {
        const { userId, otp } = req.body;

        // Users can only verify OTP for themselves
        if (userId !== req.body.userId) {
            return res.send({
                success: false,
                message: "You can only verify OTP for your own account"
            });
        }

        const otpRecord = await OTP.findOne({
            userId,
            otp,
            purpose: 'password_change',
            isUsed: false
        }).populate('userId');

        if (!otpRecord) {
            return res.send({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        // Check if OTP is expired
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.send({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        // Mark OTP as used
        await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });

        // Generate a temporary token valid for 10 minutes to allow password change
        const tempToken = jwt.sign(
            { userId, purpose: 'password_change' },
            process.env.jwt_secret,
            { expiresIn: '10m' }
        );

        res.send({
            success: true,
            message: "OTP verified successfully",
            tempToken
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

// update user password (with temp token verification)
router.post('/update-password', authMiddleware, async(req,res) => {
    try {
        const { userId, newPassword, tempToken } = req.body;

        // Users can only update their own password
        if (userId !== req.body.userId) {
            return res.send({
                success: false,
                message: "You can only update your own password"
            });
        }

        // Verify temp token if provided (OTP-verified password change)
        if (tempToken) {
            try {
                const decoded = jwt.verify(tempToken, process.env.jwt_secret);
                if (decoded.userId !== userId || decoded.purpose !== 'password_change') {
                    return res.send({
                        success: false,
                        message: "Invalid or expired verification token"
                    });
                }
            } catch (error) {
                return res.send({
                    success: false,
                    message: "Invalid or expired verification token"
                });
            }
        } else {
            // Fallback to old method (current password verification) for backward compatibility
            const { currentPassword } = req.body;
            const user = await User.findById(userId);

            // Verify current password
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.send({
                    success: false,
                    message: "Current password is incorrect"
                });
            }
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        res.send({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
})

module.exports = router;