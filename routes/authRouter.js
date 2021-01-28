const {verifySignUp} = require("../middlewares");
const controller = require("../controllers/auth.controller")
const bodyParser = require('body-parser');
const authJwt = require("../middlewares/authJwt");

module.exports = function(app){
    app.use((req,res,next)=>{
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })
    app.use(bodyParser.json());

    app.post("/auth/signin",
      [authJwt.isLoggedIn],
        controller.validate('signin'),
        controller.signin, controller.updateCart, controller.reponseSignin
    );
    app.post("/auth/signup",
            [
              verifySignUp.checkDuplicateUser
            ],
            controller.validate('signup'),
            controller.signup
          );
    app.post("/auth/logout",controller.logout)
          
    app.get("/auth/confirmation/:token",controller.verifyEmailToken)
    app.post("/auth/token", [authJwt.verifyToken], controller.resendToken)
}