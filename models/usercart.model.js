const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    }
},{_id: false})

const UserCart = mongoose.model(
    "Cart",
    new mongoose.Schema({
        uid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        items: [ItemSchema],
        totalQuantity: {
            type: Number,
            default: 0
        },
    },
    {
        minimize: false
    })
)

module.exports = UserCart;