const userRouter = require("./userRouter");
const authRouter = require("./authRouter");
const bookRouter = require("./bookRouter");
const cartRouter = require("./cartRouter");
const adminRouter = require("./adminRouter");

const seeds = require("../seeds/index");
const authJwt = require("../middlewares/authJwt");

module.exports = function(app){
    app.get("/",(req,res)=>{
        res.status(200).send({
            message: "Server"
        })
    })
    
    // app.post("/seed",(req,res)=>{
    //     seeds.categoriesInit();
    //     seeds.booksInit();
    //     res.send("Seeds Complete")
    // })

    userRouter(app);
    authRouter(app);
    bookRouter(app);
    cartRouter(app);
    adminRouter(app);

    // Handle 404 error
    app.use(function(req, res, next) {
        const err = new Error("404. Page not found!!");
        err.statusCode = 404;
        err.status = 404;
        next(err);
    });

}