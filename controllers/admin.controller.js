const db = require("../models/");
const Role = require("../models/role.model");
const Coupon = db.coupon;
const User = db.user;
const Order = db.order;
const {body,param,validationResult} = require('express-validator');

exports.validate = (method)=>{
    switch(method){
        case 'addCoupon': {
            return [
                body('isPercent').optional().isBoolean(),
                body('maxDiscount').optional().isNumeric(),
                body('minRequirement').optional().isNumeric(),
                body('amount', 'Invalid Amount').exists().isNumeric(),
                body('expiredAt').optional().isNumeric(),
            ]
        };
        case 'getUser' :{
            return  [
                param('id','Invalid Id').exists().isMongoId(),
            ]
        };
        case 'getUserOrders' :{
            return [
                param('id','Invalid Id').exists().isMongoId(),
            ]
        };
        case 'disableUser':
        case 'enableUser': {
            return [
                param('id','Invalid Id').exists().isMongoId(),
            ]
        }
        case 'setRole': {
            return [
                param('id','Invalid User Id').exists().isMongoId(),
                param('role','Invalid Role').exists().isString(),
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

exports.addCoupon = (req,res,next)=>{
    try {
        const coupon = new Coupon({
            code: req.body.code
        });
        if(req.body.isPercent){
            coupon.isPercent = true;
            if(req.body.maxDiscount){
                coupon.maxDiscount= req.body.maxDiscount
            }
        }
        if(req.body.minRequirement){
            coupon.minRequirement = req.body.minRequirement
        }
        
        coupon.amount = req.body.amount;
        if(req.body.expiredAt){
            const time = req.body.expiredAt;
            coupon.expiredAt = new Date(Date.now()+time);
        }
        coupon.save((err,cp)=>{
            if(err){
                if (err.name === 'MongoError' && err.code === 11000) {  // Duplicate coupon code 
                    return res.status(409).send({message: 'Coupon code already exists!' });
                }
                return res.status(500).send(err);
            }
            res.status(201).send({
                message: 'success',
                coupon: cp
            })
        })
    
    } catch (error) {
        next(error);
    }
}

exports.getCoupon = async (req,res,next)=>{
    try {
        const coupons = await Coupon.find()
            .sort({isActive: -1})
            .select("-__v")
        res.status(200).send(coupons);
    } catch (error) {
        next(error);
    }
}

exports.getUsers = async (req,res,next)=>{
    try {
        const users = await User.find()
                        .select("-__v -password");
        res.status(200).send(users);
    } catch (error) {
        next(error);
    }
}

exports.getUserProfile = async (req,res,next)=>{
    try {
        const id = req.params.id;
        const user = await User.findById(id)
                                .select("-__v -password")
        if(!user){
            return res.status(404).send({
                message: "User not found"
            })
        }
        res.status(200).send(user);
    } catch (error) {
        next(error);   
    }
}

exports.getUserOrders = async (req,res,next)=>{
    try {
        const uid = req.params.id; 
        const order = await Order.find({uid});
        res.status(200).send(order);
    } catch (error) {
        next(error);
    }
}

exports.disableUser = async (req,res,next)=>{
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send({
                message: "User not found!!"
            })
        }
        if(!user.isActive){
            return res.status(401).send({message: "User account is already blocked"})
        }
        user.isActive = false;
        user.save();
        
        const mailOptions = {
            from: 'no-reply@yourwebapplication.com',
            to: user.email, subject: 'Account Blocked',
            text: 'Dear ' + user.firstName + ',\n\n' + 'Your account has been disabled by Admin'
        };

        const transporter = nodemailer.createTransport(smtpTransport({
            secure: false, // use SSL
            service: 'gmail',
            port: 25, // port for secure SMTP
            auth: {
                user: emailConfig.email,
                pass: emailConfig.password
            },
            tls: {
                rejectUnauthorized: false
            }
        }));
        transporter.sendMail(mailOptions, function (err) {
            if (err) {return res.status(500).send({ msg: err }); }
            res.status(200).send({message: "User "+ user._id +" is blocked"});
        });
    
    } catch (error) {
        next(error);
    }
}

exports.enableUser = async (req,res,next)=>{
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send({
                message: "User not found!!"
            })
        }
        if(!user.isActive){
            return res.status(401).send({
                message: "User account is already blocked"
            })
        }
        user.isActive = false;
        user.save();
    
        const mailOptions = {
            from: 'no-reply@yourwebapplication.com',
            to: user.email, subject: 'Account Activation',
            text: 'Dear ' + user.firstName + ',\n\n' + 'Your account has been opened. Free to use!!'
        };
    
        const transporter = nodemailer.createTransport(smtpTransport({
            secure: false, // use SSL
            service: 'gmail',
            port: 25, // port for secure SMTP
            auth: {
                user: emailConfig.email,
                pass: emailConfig.password
            },
            tls: {
                rejectUnauthorized: false
            }
        }));
        transporter.sendMail(mailOptions, function (err) {
            if (err) {return res.status(500).send({ msg: err }); }
            res.status(200).send({message: "User "+ user._id +" is blocked"});
        });    
    } catch (error) {
        next(error);
    }
}

exports.setRole= async (req,res,next)=>{
    try {
        const uid = req.params.id;
        const roleParam = req.params.role;
        if(!db.mongoose.Types.ObjectId.isValid(uid)){
            return res.status(404).json({
                message: "Error, Page not Found"
            })
        }
        const role = await Role.findOne({name:roleParam});
        if(!role){
            return res.status(404).json({
                message: "Error, Role not Found"
            })
        }
        const user = await User.findById(uid);
        if(!user){
            return res.status(400).json({
                message: "Error, User not Found"
            })
        }
        if(user.roles.includes(role._id)){
            return res.status(400).json({
                message: "Role is already set"
            })
        }
        user.roles.push(role._id);
        user.save();
        res.status(200).send({
            message: "User "+user._id+ "is set to "+role.name+"."
        });   

    } catch (error) {
        next(error);
    }
}
