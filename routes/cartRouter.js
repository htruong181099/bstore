const controller = require('../controllers/cart.controller');
const authJwt = require('../middlewares/authJwt');
const coupon = require('../middlewares/coupon');

const router = require('express').Router();

router.get('/cart', [authJwt.isLoggedIn], controller.getCart);
router.get(
	'/cart/add-to-cart/:id',
	[authJwt.isLoggedIn],
	controller.validate('add'),
	controller.validateErrorHandler,
	controller.addtoCart
);

router.get('/cart/remove-cart', [authJwt.isLoggedIn], controller.removeCart);
router.get(
	'/cart/remove-item/:id',
	[authJwt.isLoggedIn],
	controller.validate('remove'),
	controller.validateErrorHandler,
	controller.removeItem
);
router.get(
	'/cart/reduce/:id',
	[authJwt.isLoggedIn],
	controller.validate('reduce'),
	controller.validateErrorHandler,
	controller.reduceByOne
);

router.get(
	'/cart/checkout/',
	[authJwt.verifyToken, coupon.checkCart, coupon.checkValidCoupon],
	controller.validate('coupon'),
	controller.validateErrorHandler,
	controller.applyCoupon,
	controller.getCheckout
);

router.post(
	'/cart/checkout/',
	[authJwt.verifyToken, coupon.checkCart, coupon.checkValidCoupon],
	controller.validate('coupon'),
	controller.validateErrorHandler,
	controller.applyCoupon,
	controller.checkout
);

module.exports = router;
