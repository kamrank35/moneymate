const router = require('express').Router();
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');


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

// update user password
router.post('/update-password', authMiddleware, async(req,res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        // Users can only update their own password
        if (userId !== req.body.userId) {
            return res.send({
                success: false,
                message: "You can only update your own password"
            });
        }

        const user = await User.findById(userId);

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.send({
                success: false,
                message: "Current password is incorrect"
            });
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