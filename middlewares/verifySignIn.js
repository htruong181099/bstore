checkSignIn = (req,res,next)=>{
    if(req.userId){
        return res.status(400).send({
            message: "User is already signed in"
        })
    }
    next();
}

checkLogout = (req,res,next)=>{
    if(!req.userId){
        return res.status(400).send({
            message: "User is not signed in yet"
        })
    }
    next();
}

module.exports = {
    checkSignIn,
    checkLogout
}