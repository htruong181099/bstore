const mongoose = require('mongoose');

const Coupon = mongoose.model(
    "Coupon",
    new mongoose.Schema({
        code: {
            type: String,
            unique: true,
            required: true
        },
        description: {
            type: String
        },
        isPercent: {
            type: Boolean
        },
        minRequirement:{
            type: Number,
        },
        maxDiscount: {
            type: Number,
        },

        //percent if isPercent or number
        amount :{
            type: Number,
            required: true
        },
        createdAt: {
            type : Date,
            default : Date.now
        },
        expiredAt: {
            type: Date,
        },
        isActive:{
            type: Boolean,
            default: true
        },
        used : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    })
)

module.exports = Coupon;