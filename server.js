const express = require('express');
const app = express();
const session = require('express-session');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Database
const db = require('./models');
const MongoStore = require('connect-mongo')(session);

// Middlewares
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/public', express.static('public'));

app.use(
	session({
		secret: 'minimaximiddi',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection: db.mongoose.connection,
		}),
		cookie: {
			maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
		},
	})
);

app.use((req, res, next) => {
	res.locals.session = req.session;
	next();
});

// Routes
const router = require('./routes');
app.use(router);

// Train data
const { trainRecommendedData } = require('./services/training.services');
trainRecommendedData();

// Error handling
app.use((err, req, res, next) => {
	const error = err;
	error.statusCode = err.statusCode || 500;
	error.status = err.status || 'error';

	//Log Error Stack
	console.error(error.stack);
	res.status(error.statusCode).send({
		status: error.status,
		message: error.message,
	});
});

app.listen(PORT, () => console.log(`App listening at PORT: ${PORT}`));
