const controller = require("../controllers/cart.controller");
const authJwt = require("../middlewares/authJwt");
const coupon = require("../middlewares/coupon");

module.exports = function(app){
    app.get("/cart", [authJwt.isLoggedIn],controller.getCart);
    app.get("/cart/add-to-cart/:id", [authJwt.isLoggedIn] ,
        controller.validate('add'),
        controller.validateErrorHandler,
        controller.addtoCart
    );

    app.get("/cart/remove-cart", [authJwt.isLoggedIn],controller.removeCart)
    app.get("/cart/remove-item/:id", [authJwt.isLoggedIn],
        controller.validate('remove'),
        controller.validateErrorHandler,
        controller.removeItem
    )
    app.get("/cart/reduce/:id", [authJwt.isLoggedIn],
        controller.validate('reduce'),
        controller.validateErrorHandler,
        controller.reduceByOne
    )

    app.get("/cart/checkout/", 
        [authJwt.verifyToken,coupon.checkCart,coupon.checkValidCoupon], 
        controller.validate('coupon'),
        controller.validateErrorHandler,
        controller.applyCoupon,
        controller.getCheckout
    )

    app.post("/cart/checkout/", 
        [authJwt.verifyToken,coupon.checkCart,coupon.checkValidCoupon], 
        controller.validate('coupon'),
        controller.validateErrorHandler,
        controller.applyCoupon, 
        controller.checkout
    )

}