const mg = require('mongoose')

const transactionsSchema = new mg.Schema({
    amount:{
        type:Number,
        required:true
    },
    sender:{
        type:mg.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    receiver:{
        type:mg.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    reference:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
        enum: ['deposit', 'transfer', 'withdrawal']
    },
} , {
    timestamps:true 
})

module.exports = mg.model("transactions",transactionsSchema)