const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./user.model');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_PHONE = process.env.ADMIN_PHONE;
const ADMIN_FNAME = process.env.ADMIN_FNAME;
const ADMIN_LNAME = process.env.ADMIN_LNAME;
const ADMIN_ROLES = process.env.ADMIN_ROLES;

const db = {};
db.mongoose = mongoose;
db.user = require('./user.model');
db.role = require('./role.model');
db.book = require('./book.model');
db.category = require('./category.model');
db.emailToken = require('./token.model');
db.rating = require('./rating.model');
db.cart = require('./cart.model');
db.usercart = require('./usercart.model');
db.order = require('./order.model');
db.coupon = require('./coupon.model');
db.ROLES = ['user', 'admin', 'mod'];

const Role = db.role;

module.exports = db;
db.mongoose
	.connect(
		process.env.MONGODB_URI ||
			`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`,

		// .connect(`mongodb+srv://hoangtruong181099:dqgruapam@bookdb.gvmyz.mongodb.net/BookDB?retryWrites=true&w=majority`
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log('Connect successfully to MongoDB');
		initial();
	})
	.catch((err) => {
		console.log('URI: ' + process.env.MONGODB_URI);
		console.error('Connect error ', err);
		process.exit();
	});

initial = async () => {
	await Role.estimatedDocumentCount(async (err, count) => {
		try {
			if (count === 0) {
				await new Role({ name: 'user' }).save();
				console.log("added 'user' to roles collection");

				await new Role({ name: 'admin' }).save();
				console.log("added 'admin' to roles collection");

				await new Role({ name: 'mod' }).save();
				console.log("added 'mod' to roles collection");

				User.estimatedDocumentCount(async (err, count) => {
					if (err) {
						return next(err);
					}
					if (!err && count === 0) {
						try {
							const user = new User({
								email: ADMIN_EMAIL,
								firstname: ADMIN_FNAME,
								lastname: ADMIN_LNAME,
								phone: ADMIN_PHONE,
								roles: ADMIN_ROLES,
								password: bcrypt.hashSync(ADMIN_PASSWORD, 8),
							});
							const adminRoles = await Role.findOne({
								name: ADMIN_ROLES,
							}).select('_id');
							user.roles = adminRoles._id;
							await user.save();
							console.log('add admin to db');
						} catch (error) {
							console.error(error);
						}
					}
				});
			}
		} catch (error) {
			next(error);
		}
	});
};
