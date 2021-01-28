const jwt = require('jsonwebtoken');
const config = require("../configs/jwt.config.js")
const db = require("../models")

const User = db.user;
const Role  = db.role;

verifyToken = (req,res,next) =>{
    const token = req.headers["x-access-token"];
    if(!token){
        return res.status(403).send({
            message: "Require token!!!"
        })
    }
    jwt.verify(token, config.secret, (err,decoded)=>{
        if(err){
            return res.status(403).send({
                message: "Unauthorized or token had been expired!!"
            })
        }
        req.userId = decoded.id;
        next();
    })
}

isLoggedIn = (req,res,next) =>{
    let token = req.headers["x-access-token"];
    if(!token){
        return next();
    }
    jwt.verify(token, config.secret, (err,decoded)=>{
        if(err){
            return res.status(403).send({
                message: "Unauthorized or token had been expired!!"
            })
        }
        req.userId = decoded.id;
        next();
    })
}

isActive = async (req,res,next) =>{
    try {
        const user = User.findById(req.userId);
        if(!user.isActive){
            return res.status(403).send({
                message: "Cant access. Account has been blocked."
            })
        }
        return next();
    } catch (err) {
        next(err);
    }   
}

isAdmin = async (req,res,next) =>{
    try {
        const user = await User.findById(req.userId);
        const roles = await Role.find({_id : {$in: user.roles}});
        for(let i=0;i<roles.length;i++){
            if(roles[i].name === 'admin'){
                return next();
            }
        }
        res.status(403).send({message: "Require Admin Role!" });
    } catch (err) {
        next(err);   
    }
}

isMod = async (req,res,next) =>{
    try {
        const user = await User.findById(req.userId);
        const roles = await Role.find({_id : {$in: user.roles}});
        for(let i=0;i<roles.length;i++){
            if(roles[i].name ==='mod' || roles[i].name ==='admin'){
                return next();
            }
        }
        res.status(403).send({message: "Require Mod Role!" });
    } catch (err) {
        next(err);   
    }
}

module.exports = {
    verifyToken,
    isLoggedIn,
    isAdmin, 
    isMod,
    isActive
}