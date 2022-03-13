const controller = require('../controllers/admin.controller');
const { authJwt } = require('../middlewares');

const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('Server');
});

router.post(
	'/mod/add-coupon',
	[authJwt.verifyToken, authJwt.isMod],
	controller.validate('addCoupon'),
	controller.validateErrorHandler,
	controller.addCoupon
);

router.get(
	'/mod/coupons',
	[authJwt.verifyToken, authJwt.isMod],
	controller.getCoupon
);

router.get(
	'/admin/users',
	[authJwt.verifyToken, authJwt.isAdmin],
	controller.getUsers
);

router.get(
	'/admin/users/:id',
	[authJwt.verifyToken, authJwt.isAdmin],
	controller.validate('getUser'),
	controller.validateErrorHandler,
	controller.getUserProfile
);

router.get(
	'/admin/users/orders/:id',
	[authJwt.verifyToken, authJwt.isAdmin],
	controller.validate('getUserOrders'),
	controller.validateErrorHandler,
	controller.getUserProfile
);

router.get(
	'/admin/disable-user/:id',
	[authJwt.verifyToken, authJwt.isAdmin],
	controller.validate('disableUser'),
	controller.validateErrorHandler,
	controller.disableUser
);

router.get(
	'/admin/enable-user/:id',
	[authJwt.verifyToken, authJwt.isAdmin],
	controller.validate('enableUser'),
	controller.validateErrorHandler,
	controller.enableUser
);

router.get(
	'/admin/setRole/:role/:id',
	[authJwt.verifyToken, authJwt.isAdmin],
	controller.validate('setRole'),
	controller.validateErrorHandler,
	controller.setRole
);

module.exports = router;
