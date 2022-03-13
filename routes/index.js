const router = require('express').Router();
// const userRouter = require('./userRouter');
const authRouter = require('./authRouter');
const bookRouter = require('./bookRouter');
const cartRouter = require('./cartRouter');
const adminRouter = require('./adminRouter');

// router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/books', bookRouter);
router.use('/cart', cartRouter);
router.use('/admin', adminRouter);

// Handle 404 error
router.use(function (req, res, next) {
	const err = new Error('404. Page not found!!');
	err.statusCode = 404;
	err.status = 404;
	next(err);
});

module.exports = router;

// const cartRouter = require('./cartRouter');
// const adminRouter = require('./adminRouter');

// const seeds = require('../seeds/index');
// const authJwt = require('../middlewares/authJwt');

// router.get('/', (req, res) => {
// 	res.status(200).send({
// 		message: 'Server',
// 	});
// });

// app.post("/seed",(req,res)=>{
//     seeds.categoriesInit();
//     seeds.booksInit();
//     res.send("Seeds Complete")
// })

// userRouter(router);
// authRouter(router);
// bookRouter(router);
// cartRouter(router);
// adminRouter(router);
