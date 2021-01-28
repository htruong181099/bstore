const mongoose = require('mongoose');

const Rating = mongoose.model(
    "Rating",
    new mongoose.Schema({
        bookID : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        rating : {
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        text: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    })
)

module.exports = Rating;