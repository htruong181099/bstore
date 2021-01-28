const db= require("../models");
const Coupon = require("../models/coupon.model");
const Cart = db.cart;
const Book = db.book;
const Order = db.order;
const UserCart = db.usercart;

const {param, query, validationResult} = require("express-validator");

exports.validate = (method)=>{
    switch(method){
        case 'add':{
            return [
                param('id','Invalid BookID').exists().isMongoId()
            ]
        };
        case 'remove':{
            return [
                param('id','Invalid BookID').exists().isMongoId()
            ]
        };
        case 'reduce':{
            return [
                param('id','Invalid BookID').exists().isMongoId()
            ]
        };
        case 'coupon':{
            return [
                query('coupon').optional().isString()
            ]
        }
    }
}

exports.validateErrorHandler = (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error();
        err.status = err.statusCode = 422;
        err.message = [...new Set(errors.array().map(err=>err.msg))];
        return next(err);
    }
    next();
}

exports.addtoCart = async (req,res,next)=>{
    try {
        const bookid = req.params.id;
        const book = await Book.findById(bookid);
        if(!book){
            return res.status(404).send({
                message: "Book not found. Invalid ID"
            })
        }
        if(book.quantity === 0){
            return res.status(400).send({
                message: "Book is not available now"
            })
        }
    
        if(!req.userId){
            const cart = new Cart(req.session.cart?req.session.cart:{});
            if(!cart.add(book, bookid)){
                return res.status(200).send({
                    message: "Can not add more items"
                })
            }
            req.session.cart = cart;
            return res.status(200).send({
                message: "Add to cart successful",
                cart: cart
            })
        }
        
        const uid = req.userId;
        const ucart = await UserCart.findOne({uid: req.userId});
        const cart = new Cart(ucart?ucart:{});
        if(!cart.add(book, bookid)){
            return res.status(200).send({
                message: "Can not add more items"
            })
        }
        if(ucart){
            ucart.items = cart.items;
            ucart.totalQuantity = cart.totalQuantity;
            ucart.save();
            return res.status(200).send({
                message: "Add to cart successful",
                cart
            })
        }
        const userCart = new UserCart({
            uid,
            totalQuantity: cart.totalQuantity,
        })
        userCart.items = cart.items
        userCart.save();
        return res.status(200).send({
            message: "Add to cart successful",
            cart 
        })
    
    } catch (error) {
        next(error);
    }    
}

exports.getCart = async (req,res,next)=>{
    try {
        if(req.userId){
            const cart = await UserCart.findOne({uid:req.userId});
            if(!cart){
                return res.status(200).send(new Cart({}));
            }
            return res.status(200).send(await (new Cart(cart)).getCart())
        }
        if(req.session.cart){
            return res.status(200).send(await new Cart(req.session.cart).getCart());
        }
        return res.status(200).send(new Cart({}))
    } catch (error) {
        next(error);
    }
}

exports.removeCart = async (req,res,next)=>{
    if(!req.userId){
        if(req.session.cart){
            req.session.cart = null;
            return res.status(200).send({
                message: "Successfully remove cart"
            })
        }
        return res.status(400).send({
            message: "Cart is empty"
        })
    }

    try {
        const uid = req.userId;
        const cart = await UserCart.findOne({uid})
        if(!cart){
            return res.status(400).send({
                message: "Cart is empty"
            })
        }
        cart.remove();
        return res.status(200).send({
            message: "Remove cart successfully"
        })
    } catch (error) {
        next(error);
    }
    
}

exports.removeItem = async (req,res,next)=>{
    const id= req.params.id;
    if(!req.userId){
        const cart = new Cart(req.session.cart?req.session.cart:{});
        if(!cart.removeItem(id)){
            return res.status(400).send({
                message: "Item is not in cart"
            })
        };
        req.session.cart = cart;
        return res.status(200).send({
            message: "Remove item successfully"
        })
    }
    try {
        const ucart = await UserCart.findOne({uid: req.userId});
        const cart= new Cart(ucart);
        if(!cart.removeItem(id)){
            return res.status(400).send({
                message: "Item is not in cart"
            })
        };
        if(cart.totalQuantity==0){
            ucart.remove();
            return res.status(200).send({
                message: "Remove item successfully"
            })
        }
        ucart.items = cart.items;
        ucart.totalQuantity = cart.totalQuantity;
        ucart.markModified('items');
        ucart.save();
        return res.status(200).send({
            message: "Remove item successfully"
        })
    } catch (error) {
        next(error);
    }
}

exports.reduceByOne = async (req,res,next)=>{
    const id = req.params.id;
    if(!req.userId){
        const cart = new Cart(req.session.cart?req.session.cart:{});
        if(!req.session.cart){
            return res.status(400).send({
                message: "Cart is Empty"
            })
        }
        if(!cart.reduceOne(id)){
            return res.status(400).send({
                message: "Item is not in cart"
            })
        }
        
        req.session.cart = cart;
        return res.status(200).send({
            message: "Reduce successfully",
            cart
        })
    }
    
    try {
        const ucart = await UserCart.findOne({uid: req.userId});
        if(!ucart){
            return res.status(400).send({
                message: "Cart is Empty"
            })
        }
        const cart = new Cart(ucart);
        if(!cart.reduceOne(id)){
            return res.status(400).send({
                message: "Item is not in cart"
            })
        }
        ucart.items = cart.items;
        ucart.totalQuantity = cart.totalQuantity;
        ucart.markModified('items');
        ucart.save(err=>{
            if(err){
                return res.status(500).send({
                    message: err
                })
            }
        })
        
        return res.status(200).send({
            message: "Reduce successfully",
            cart
        })

    } catch (error) {
        next(error);
    }
}

exports.applyCoupon = async (req,res,next)=>{
    if(!req.query.coupon){
        return next();
    }

    try {
        const ucart = await UserCart.findOne({uid:req.userId});
        const totalAmount = await (await (new Cart(ucart)).getCart()).totalAmount;
        const coupon = await Coupon.findOne({code:req.query.coupon});
        let min = true;
        if(coupon.minRequirement){
            min=(totalAmount > coupon.minRequirement) ? true : false ;
        }

        if(!min){
            return res.status(202).send({
                message: "Does not meet Requirement"
            })
        }

        if(coupon.isPercent){
            const max = coupon.maxDiscount ? coupon.maxDiscount : Infinity;
            const discount = (coupon.amount/100*totalAmount)>max?max:(coupon.amount/100*totalAmount);
            const total = totalAmount - discount;
    
            req.coupon = {
                coupon: coupon._id,
                code: coupon.code,
                total
            };
            return next();
        }
    
        req.coupon = {
            coupon: coupon._id,
            code: coupon.code,
            total: totalAmount - coupon.amount
        };
    
        return next();

    } catch (error) {
        next(error);
    }
}

exports.getCheckout = async (req,res,next)=>{
    try {
        const ucart = await UserCart.findOne({uid:req.userId});
        if(!ucart){
            return res.status(400).send({
                message: "Empty cart"
            })
        }
        const cart = await new Cart(ucart).getCart();
        if(req.coupon){
            return res.status(200).send({
                cart,
                coupon: req.coupon.coupon,
                total: req.coupon.total
            })
        }
        return res.status(200).send({
            cart,
            total: cart.totalAmount
        })
    } catch (error) {
        next(error);
    }
}
 
exports.checkout = async (req,res,next)=>{
    try {
        const userCart = await UserCart.findOne({uid:req.userId});
        if(!userCart){
            return res.status(400).send({
                message: "Empty cart"
            })
        }
        const cart = await(new Cart(userCart)).getCart();
        const order = new Order({
            uid : req.userId,
            cart,
            address : req.body.address,
            total: cart.totalAmount,
            notes: req.body.notes
        })
        if(req.coupon){
            order.coupon = req.coupon.coupon;
            order.total= req.coupon.total
        }
        await order.save();

        const books = await Book.find({
            _id: {$in: cart.items.map(item=>item.id)}
        }).select("_id quantity");

        books.forEach(async(book)=>{
            cart.items.find(item=>{
                return item.id == book.id;
            });
            const item = cart.items.find(item=>item.id == book._id)
            book.quantity -= item.quantity;
            await book.save();
        })

        if(req.coupon){
            await Coupon.findById(req.coupon.coupon,(err,coupon)=>{
                coupon.used.push(req.userId);
                coupon.save();
            })
        }

        userCart.remove();
        return res.status(200).send({
            message: "Checkout successfully",
            order
        })
    } 
    catch (error) {
        next(error);
    }
}
