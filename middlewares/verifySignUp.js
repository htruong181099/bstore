const db = require("../models/index");
const User = db.user;
const Roles = db.ROLES;

checkDuplicateUser = async (req, res, next) => { // Email
  const user = await User.findOne({email: req.body.email})
  if (user) {
    return res.status(400).send({
      message: "Failed! Email is already in use!" 
    });
  }
  next();
};

const verifySignUp = {
    checkDuplicateUser
  };
  
module.exports = verifySignUp;