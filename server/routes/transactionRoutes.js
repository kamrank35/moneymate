const router = require('express').Router()
const Transactions = require ("../models/transactionModel")
const authMiddleware = require ("../middlewares/authMiddleware")
const User = require('../models/userModel')

const stripe =require("stripe")(process.env.stripe_key)
const { uuid } = require("uuidv4");

// Tranfer money one to other Acc

router.post('/transfer-funds', authMiddleware, async(req,res)=> {

    try {
        // Get sender's current balance
        const sender = await User.findById(req.body.sender)
        if(!sender){
            return res.send({
                message:"Sender not found",
                success:false
            })
        }

        // Check if sender has sufficient balance
        if(req.body.amount > sender.balance){
            return res.send({
                message:"Insufficient balance",
                success:false
            })
        }

        // save the transaction
        const newTransaction = new Transactions(req.body)
        await newTransaction.save()

        // decrease sender balance
        await User.findByIdAndUpdate(req.body.sender, {
            $inc: { balance: -req.body.amount }
        })


        // Increase receiver balance
        await User.findByIdAndUpdate(req.body.receiver, {
            $inc: { balance: req.body.amount }
        })
        res.send({
            message:"Transaction Successfull",
            data : newTransaction,
            success:true
        })

    } catch (error) {
        res.send({
            message:"Transaction failed",
            data : error.message,
            success:false
        })
    }

})

// verify receiver acc no.

router.post('/verify-account',authMiddleware,async (req,res) =>{
    try {
        const user = await User.findOne({_id: req.body.receiver })
        if(user){
            res.send({
                message:"Account verified",
                data : user,
                success:true
            })
        }else{
            res.send({
                message:"Account not found",
                data : null,
                success:false
            })
        }
    } catch (error) {
        res.send({
            message:"Account not found",
            data : error.message,
            success:false
        })
    }
})

// get all transactions 

router.post('/get-all-transactions-by-user', authMiddleware , async(req,res) =>{
    try {
        const transactions = await Transactions.find({$or : [{sender : req.body.userId} , {receiver : req.body.userId}]}).sort({ createdAt : -1}).populate('sender').populate('receiver')
        res.send({
            message:"Transaction fetched",
            data : transactions,
            success:true
        })
    } catch (error) {
        res.send({
            message:"Transaction not fetched",
            data : error.message,
            success:false
        })
    }
})

// deposite funds using stripe

router.post('/deposite-funds', authMiddleware , async(req,res) =>{
    try {
        const { token, amount } = req.body;
        // create a customer
        const customer = await stripe.customers.create({
            email : token.email,
            source : token.id,

        })

        // create a charge
        const charge = await stripe.charges.create({
            amount: amount,
            currency:'usd',
            customer : customer.id , 
            receipt_email : token.email,
            description : "Deposited to MoneyMate"
        },{
            idempotencyKey: uuid(),
        }
    );


    // Save the transaction

    if(charge.status === "succeeded"){
        const newTransaction = new Transactions({
            sender : req.body.userId,
            receiver : req.body.userId,
            amount : amount,
            type : 'deposit',
            reference : "stripe deposite",
            status:"success",
        })
        await newTransaction.save()

        // Increase the user balance

        await User.findByIdAndUpdate(req.body.userId, {
            $inc : {balance : amount}
        })
        res.send({
            message:"Transaction Successfull",
            data : newTransaction,
            success:true
        })
    }else{

        res.send({
            message:"Transaction failed",
            data : charge,
            success:false
        })
    }
    } catch (error) {
        res.send({
            message:"Transaction failed",
            data : error.message,
            success:false
        })
    }
})

module.exports = router