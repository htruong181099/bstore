const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        unique: true
    },
    item:{
        title: {
            type: String,
        },
        saleprice: {
            type: Number,
            required: true
        },
        coverimg: {
            type: String,
        }
    },
    quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
},{_id: false})

const Order = mongoose.model(
    "Order",
    new mongoose.Schema({
        uid : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        cart : {
            items: [ItemSchema],
            totalQuantity: {
                type: Number
            },
            totalAmount: {
                type: Number
            }
        },
        address :{
            type: String,
            required: true
        },
        coupon: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Coupon"
        },
        total: {
            type: Number,
            required: true
        },
        notes:{
            type:String,
            required: false
        },
        date: {
            type: Date,
            default: Date.now
        }

    })
)

module.exports = Order;