const controller = require('../controllers/user.controller');
const authJwt = require('../middlewares/authJwt');

const router = require('express').Router();

router.get('/', [authJwt.verifyToken, authJwt.isActive], controller.getProfile);

// router.put(
// 	'/',
// 	[authJwt.verifyToken, authJwt.isActive],
// 	controller.validate('update'),
// 	controller.validateErrorHandler,
// 	controller.updateProfile
// );

// router.get(
// 	'/orders',
// 	[authJwt.verifyToken, authJwt.isActive],
// 	controller.getOrders
// );

module.exports = router;
