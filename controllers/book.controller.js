const db = require("../models");
const Book = db.book;
const Rating = db.rating;
const Category = db.category;
const {body, param, query, validationResult} = require("express-validator");
const fs = require('fs');
const path = require('path');


//input validation
exports.validate = (method)=>{
    switch(method){
        case 'add':{
            return [
                body('title','Invalid Title').exists().isString(),
                body('isbn','Invalid Isbn').exists().isString(),
                body('author','Invalid Author').exists().isString(),
                body('publisher','Invalid Publisher').exists().isString(),
                body('description','Invalid Description').optional().isString(),
                body('price','Invalid Price').exists().isInt(),
                body('saleprice','Invalid Saleprice').exists().isInt(),
                body('quantity','Invalid Title').exists().isInt(),
                body('tags','Invalid Tags').optional().isString(),
            ]
        };
        case 'remove':{
            return [
                param('id','Invalid BookID').exists().isMongoId()
            ]
        };
        case 'search':{
            return [
                query('q',"Invalid input value").exists().isString()
            ]
        };
        case 'rate':{
            return [
                param('id',"Invalid BookID").exists().isMongoId(),
                body('text').optional().isString(),
                body('rating',"Invalid rating input").exists().isInt()
            ]
        };
        case 'get':{
            return [
                param('id',"Invalid BookID").exists().isMongoId()
            ]
        };
    }
}

exports.validateErrorHandler = (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if(req.file){
            fs.unlink(path.join(__dirname,"..",req.file.path),(err) => {
                if (err) next(err);
            });
        }
        const err = new Error();
        err.status = err.statusCode = 422;
        err.message = [...new Set(errors.array().map(err=>err.msg))];
        return next(err);
    }
    next();
}

//methods
exports.addBook = async (req,res,next)=>{
    if(req.fileValidationError){
        return res.status(400).send({
            message: "Forbidden extension"
        })
    }
    try {
        const {title,isbn,author,publisher,description,price,saleprice,quantity,category,tags} = req.body;

        const categories = await Category.find({
            name: {$in : category}
        });
    
        if(!categories || (categories.length!=category.length)){
            return res.status(400).send({
                message: "Invalid Categories"
            })
        }
        const book = new Book({
            title,
            isbn,
            author,
            publisher,
            description,
            price,
            saleprice,
            quantity,
            category : categories.map(doc=>doc._id),
            tags: tags?tags.toLowerCase().split(" "):[],
            
        });
        if(req.file){
            book.coverimg = req.file.path;
        }
            
        book.save((err)=>{
            if(err){
                if (err.name === 'MongoError' && err.code === 11000) {  // Duplicate isbn
                    return res.status(409).send({message: 'Book already exists!'});
                }
                return res.status(500).send({message: err});
            }
        })
        
        res.status(200).send({
            message: "Add book successfully",
            book
        })
    
    } catch (error) {
        next(error);
    }
}

exports.removeBook = (req,res,next)=>{
    try {
        const id = req.params.id;
        Book.findOneAndDelete({_id:id},(err,book)=>{
            if(err){
                return res.status(500).send({
                    message: err
                })
            }
            if(!book){
                return res.status(400).send({
                    message: "Book not found or had been removed"
                })
            }
            return res.status(200).send({
                message: "Remove book successfully"
            })
        })
    } catch (error) {
        next(error);
    }
}

exports.rateBook = async (req,res,next)=>{
    const bookID = req.params.id;
    const userID = req.userId;
    try {
        const rating = await Rating.findOne({
            bookID,
            userID
        })
        if(rating){
            return res.status(400).send({
                message: "You have already rated this book."
            })
        }
    
        const ratingStar = req.body.rating;
        const ratingText = req.body.text;
    
        const newRating = new Rating({
            bookID,
            userID,
            rating : ratingStar,
            text: ratingText
        })
        newRating.save();
    
        const book = await Book.findById(bookID);
        const bookStar = book.rating;
        const bookNumberOfRatings = book.numberOfRatings;
    
        book.rating = (bookStar*bookNumberOfRatings+ratingStar)/(bookNumberOfRatings+1);
        book.numberOfRatings += 1;
        book.save();
    
        return res.status(200).send({
            message: "Rate Completed",
            newRating,
            book
        });
    } catch (error) {
        next(error);
    }
}

exports.getBooks = async (req,res,next)=>{
    try {
        const books = await Book.find()
            .sort({"create_date" : -1})
            .select("-__v -create_date")
        res.status(200).send(books)
    } catch (err) {
        next(err);
    }
}

exports.getBook = async (req,res,next)=>{
    try{
        const book = await Book.findById(req.params.id)
                .select("-__v -create_date");
        if(!book){
            return res.status(404).send({
                message: "Book not found"
            })
        }
        return res.status(200).send(book);
    }
    catch(err){
        next(err)
    }   
}

exports.searchBooks = (req,res,next)=>{
    // Book.find({$or:
    //     [{title: { '$regex' : req.query.q, '$options' : 'i' }},
    //     {author: { '$regex' : req.query.q, '$options' : 'i' }}
    // ]})
    const searchQuery = req.query.q;
    Book.find({
        $text: {$search: searchQuery}
    })
    .populate("category")
    .select("-__v -create_date")
    .exec((err,books)=>{
        if(err){
            return res.status(500).send({
                message: err
            })
        }
        res.status(200).send(books);
    })
}

exports.getCategories = async (req,res,next)=>{
    const categories = await Category.find().select("-__v");
    res.status(200).send(categories)
}

exports.booksByCategory = async (req,res,next)=>{
    const books = await Book.find({category : req.params.id})
                    .select("-__v -create_date")
    res.status(200).send(books)
}

exports.bookContentRecommender = async (req,res,next)=>{
    const data = JSON.parse(fs.readFileSync(path.join(__dirname,"..","data","trainingdata.json")));
    const recommendBook = data[req.query.id].map(i=>i.id);
    const books = await Book.find({_id : {$in: recommendBook}})
                        .select("-__v -create_date");
    res.status(200).send(books)
}