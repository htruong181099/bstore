const db = require('../models');
const Coupon = db.coupon;
const UserCart = db.usercart;

checkCart = async (req,res,next)=>{
    if(await UserCart.findOne({uid: req.userId})){
        return next();
    }
    return res.status(400).send({
        message: "Cart is empty"
    })
}

checkValidCoupon = async (req,res,next)=>{
    if(!req.query.coupon){
        return next()
    }
    const coupon = await Coupon.findOne({
        code: req.query.coupon
    })
    if(!coupon){
        return res.status(404).send({
            message: "Invalid coupon code"
        })
    }
    if(!coupon.isActive){
        return res.status(202).send({
            message: "Coupon is expired"
        })
    }

    if((coupon.isActive && compare(Date.now(),coupon.expiredAt.getTime()))==true){
        coupon.isActive = false;
        await coupon.save(err=>{
            if(err){
                return res.status(500).send({
                    message: err
                })
            }
        })
        return res.status(202).send({
            message: "Coupon is expired"
        })
    }
    if(coupon.used.includes(req.userId)){
        return res.status(400).send({
            message: "You had used this coupon"
        })
    }
    next();
}


module.exports ={
    checkCart,
    checkValidCoupon
}

compare = (a,b)=>{
    return a>=b?true:false
}
