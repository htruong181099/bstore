const router = require('express').Router();

const { verifySignUp } = require('../middlewares');
const controller = require('../controllers/auth.controller');
const authJwt = require('../middlewares/authJwt');

router.use((req, res, next) => {
	res.header(
		'Access-Control-Allow-Headers',
		'x-access-token, Origin, Content-Type, Accept'
	);
	next();
});

router.post(
	'/signin',
	[authJwt.isLoggedIn],
	controller.validate('signin'),
	controller.signin,
	controller.updateCart,
	controller.reponseSignin
);
router.post(
	'/signup',
	[verifySignUp.checkDuplicateUser],
	controller.validate('signup'),
	controller.signup
);
router.post('/logout', controller.logout);

router.get('/confirmation/:token', controller.verifyEmailToken);
router.post('/token', [authJwt.verifyToken], controller.resendToken);

module.exports = router;
