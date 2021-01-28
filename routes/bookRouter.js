const controller = require("../controllers/book.controller")
const {verifyToken,isMod} = require("../middlewares/authJwt")
const upload = require("../middlewares/multer")

module.exports = function(app){

    app.get("/books", controller.getBooks);
    app.get("/books/search", 
        controller.validate('search'),
        controller.validateErrorHandler,
        controller.searchBooks
    );

    app.get("/books/content-recommender",controller.bookContentRecommender)

    app.get("/books/:id",
        controller.validate('get'),
        controller.validateErrorHandler,
        controller.getBook
    )

    //require login
    app.post("/books/ratebook/:id",[verifyToken],
        controller.validate('rate'),
        controller.validateErrorHandler,
        controller.rateBook
    )

    //category
    app.get("/category",controller.getCategories)
    app.get("/category/:id",
        controller.validate('get'),
        controller.validateErrorHandler,
        controller.booksByCategory
    )

    //require mod roles
    app.post("/books/addbook",[verifyToken, isMod], 
        upload.single('cover'),
        controller.validate('add'),
        controller.validateErrorHandler,
        controller.addBook
    );


    //app.patch("/books/modifybook",[verifyToken, isMod] , controller.modifyBook);
    app.delete("/books/removebook/:id",[verifyToken, isMod],
        controller.validate('remove'),
        controller.validateErrorHandler,
        controller.removeBook
    );
}