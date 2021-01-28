const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true, 
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    category : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Category"
        }
    ],
    description: String,
    price: Number,
    saleprice: {
        type: Number,
        required: true
    },
    rating : {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    numberOfRatings : {
        type: Number,
        min: 0,
        default: 0
    },
    tags : [{
        type: String
    }],
    quantity: {
        type: Number,
        min: 0,
        default: 0
    },
    coverimg: {
        type: String,
        default: "public/default/book-cover-default.png"
    },
    create_date : {
        type : mongoose.Schema.Types.Date,
        default: Date.now
    },
    
})

bookSchema.index({title: "text", author: "text"});

const Book = mongoose.model(
    "Book",
    bookSchema
)


module.exports = Book;