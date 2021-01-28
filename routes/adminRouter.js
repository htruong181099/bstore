const controller = require('../controllers/admin.controller');
const { authJwt } = require('../middlewares');

module.exports = function(app){
    app.get("/",(req,res)=>{
        res.send("Server");
    })

    app.post("/mod/add-coupon",
        [authJwt.verifyToken, authJwt.isMod],
        controller.validate('addCoupon'),
        controller.validateErrorHandler,
        controller.addCoupon
    )

    app.get("/mod/coupons",
        [authJwt.verifyToken, authJwt.isMod],
        controller.getCoupon
    )

    app.get("/admin/users",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getUsers
    )

    app.get("/admin/users/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.validate('getUser'),
        controller.validateErrorHandler,
        controller.getUserProfile
    )

    app.get("/admin/users/orders/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.validate('getUserOrders'),
        controller.validateErrorHandler,
        controller.getUserProfile
    )

    app.get("/admin/disable-user/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.validate('disableUser'),
        controller.validateErrorHandler,
        controller.disableUser
    )

    app.get("/admin/enable-user/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.validate('enableUser'),
        controller.validateErrorHandler,
        controller.enableUser
    )

    app.get("/admin/setRole/:role/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.validate('setRole'),
        controller.validateErrorHandler,
        controller.setRole
    )

}