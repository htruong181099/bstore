const controller = require("../controllers/user.controller");
const authJwt = require("../middlewares/authJwt")

module.exports = (app) =>{
    app.get("/users",
        [authJwt.verifyToken,authJwt.isActive],
        controller.getProfile)

    app.put("/users/",
        [authJwt.verifyToken,authJwt.isActive],
        controller.validate('update'),
        controller.validateErrorHandler,
        controller.updateProfile
    )

    app.get("/users/orders",
        [authJwt.verifyToken,authJwt.isActive],
        controller.getOrders)

}