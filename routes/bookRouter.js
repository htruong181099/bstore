const controller = require('../controllers/book.controller');
const { verifyToken, isMod } = require('../middlewares/authJwt');
const upload = require('../middlewares/multer');

const router = require('express').Router();

router.get('/books', controller.getBooks);
router.get(
	'/books/search',
	controller.validate('search'),
	controller.validateErrorHandler,
	controller.searchBooks
);

router.get('/books/content-recommender', controller.bookContentRecommender);

router.get(
	'/books/:id',
	controller.validate('get'),
	controller.validateErrorHandler,
	controller.getBook
);

//require login
router.post(
	'/books/ratebook/:id',
	[verifyToken],
	controller.validate('rate'),
	controller.validateErrorHandler,
	controller.rateBook
);

//category
router.get('/category', controller.getCategories);
router.get(
	'/category/:id',
	controller.validate('get'),
	controller.validateErrorHandler,
	controller.booksByCategory
);

//require mod roles
router.post(
	'/books/addbook',
	[verifyToken, isMod],
	upload.single('cover'),
	controller.validate('add'),
	controller.validateErrorHandler,
	controller.addBook
);

//router.patch("/books/modifybook",[verifyToken, isMod] , controller.modifyBook);
router.delete(
	'/books/removebook/:id',
	[verifyToken, isMod],
	controller.validate('remove'),
	controller.validateErrorHandler,
	controller.removeBook
);

module.exports = router;
