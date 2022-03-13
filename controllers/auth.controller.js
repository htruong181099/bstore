const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.PASSWORD;

//auth
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//mail module
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

//db
const db = require('../models');
const User = db.user;
const Role = db.role;
const Token = db.emailToken;
const Cart = db.cart;
const UserCart = db.usercart;

const { body, validationResult } = require('express-validator');

//validator
exports.validate = (method) => {
	switch (method) {
		case 'signup': {
			return [
				body('email', 'Invalid Email').exists().isEmail(),
				body('phone', 'Invalid Phone number').exists().isString(),
				body('firstname', 'Invalid First name').exists().isString(),
				body('lastname', 'Invalid Last name').exists().isString(),
				body('password', 'Invalid Password').exists().isString(),
			];
		}
		case 'signin': {
			return [
				body('email').exists().isEmail(),
				body('password', 'Password required').exists(),
				body('password', 'Invalid password').isString(),
			];
		}
	}
};

//methods
exports.signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res
			.status(422)
			.json({ errors: [...new Set(errors.array().map((err) => err.msg))] });
		return;
	}
	try {
		const { email, firstname, lastname, phone, password } = req.body;
		const user = new User({
			email,
			firstname,
			lastname,
			phone,
			password: bcrypt.hashSync(password, 8),
		});

		const role = await Role.findOne({ name: 'user' });
		user.roles = [role._id];
		await user.save();

		const token = new Token({
			_userid: user._id,
			token: crypto.randomBytes(16).toString('hex'),
		});
		await token.save();
		const mailOptions = {
			from: 'no-reply@application.com',
			to: user.email,
			subject: 'Account Verification Token',
			text:
				`Hello,\n\n
                Please verify your account by clicking the link: \n
                http:\/\/` +
				req.headers.host +
				`\/auth/confirmation\/` +
				token.token +
				`.\n`,
		};
		sendMail(mailOptions, res);
	} catch (err) {
		next(err);
	}
};

exports.signin = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res
			.status(422)
			.json({ errors: [...new Set(errors.array().map((err) => err.msg))] });
		return;
	}

	if (req.userId) {
		return res.status(400).send({
			message: 'User is already logged in.',
		});
	}
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select('-__v -create_date');
		if (!user) {
			return res.status(404).send({
				message: 'User not found.',
			});
		}

		const isCorrectPassword = bcrypt.compareSync(password, user.password);
		if (!isCorrectPassword) {
			return res.status(401).send({
				accessToken: null,
				message: 'Invalid Password',
			});
		}

		if (!user.isActive) {
			return res.status(400).send({
				message: 'User account is Blocked.',
			});
		}

		const token = jwt.sign({ id: user._id }, JWT_SECRET, {
			expiresIn: 86400,
		});

		req.message = {
			id: user._id,
			username: user.username,
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email,
			phone: user.phone,
			address: user.address,
			isVerified: user.isVerified,
			isActive: user.isActive,
			accessToken: token,
		};
		req.userId = user._id;
		next();
	} catch (error) {
		next(error);
	}
};

exports.updateCart = async (req, res, next) => {
	if (!req.session.cart) {
		return next();
	}
	try {
		const userCart = await UserCart.findOne({ uid: req.userId });
		if (!userCart) {
			const cart = await new Cart(req.session.cart).getCart();
			const newCart = new UserCart({
				uid: req.userId,
				items: cart.items,
				totalQuantity: cart.totalQuantity,
				// totalAmount : cart.totalAmount
			});

			req.session.destroy();
			await newCart.save();
			return next();
		}
		const cart = new Cart(userCart);
		const sessionItems = req.session.cart.items;
		const books = await Book.find({
			$in: sessionItems.map((item) => item.id),
		}).select('_id quantity');
		for (item of sessionItems) {
			const bookQuantity = books.find((book) => book.id == item.id).quantity;
			cart.addItems(item, item.id, bookQuantity);
		}
		userCart.items = cart.items;
		userCart.totalQuantity = cart.totalQuantity;

		req.session.destroy();

		await userCart.save();
		return next();
	} catch (error) {
		next(error);
	}
};

exports.reponseSignin = (req, res, next) => {
	if (req.message) {
		return res.status(200).send(req.message);
	}
	return res.status(500);
};

exports.verifyEmailToken = async (req, res, next) => {
	try {
		const token = await Token.findOne({ token: req.params.token });
		if (!token) {
			return res.status(400).send({
				message:
					'We were unable to find a valid token. Your token my have expired.',
			});
		}
		const user = await User.findById(token._userid);
		if (!user) {
			return res.status(400).send({
				message: 'We were unable to find a user for this token.',
			});
		}
		if (user.isVerified) {
			return res.status(400).send({
				message: 'Account is already verified.',
			});
		}
		user.isVerified = true;
		user.save();
		res.status(200).send('Succesfully. Account has been verified.');
	} catch (error) {
		next(error);
	}
};

exports.resendToken = async (req, res, next) => {
	const user = await User.findById(req.userId);
	if (user.isVerified) {
		return res.status(400).send({
			message: 'Account is already verified.',
		});
	}
	await Token.findOneAndDelete({ _userid: req.userId });
	const token = new Token({
		_userid: user._id,
		token: crypto.randomBytes(16).toString('hex'),
	});
	await token.save();
	const mailOptions = {
		from: 'no-reply@application.com',
		to: user.email,
		subject: 'Account Verification Token',
		text:
			`Hello,\n\n 
                Please verify your account by clicking the link: \n
                http:\/\/` +
			req.headers.host +
			`\/auth/confirmation\/` +
			token.token +
			`.\n`,
	};
	return sendMail(mailOptions, res);
};

exports.logout = (req, res, next) => {
	req.session.destroy();
	return res.send({
		message: 'Log out success',
	});
};

sendMail = (mailOptions, res) => {
	const transporter = nodemailer.createTransport(
		smtpTransport({
			secure: false, // use SSL
			service: 'gmail',
			port: 25, // port for secure SMTP
			auth: {
				user: EMAIL_ACCOUNT,
				pass: EMAIL_PASSWORD,
			},
			tls: {
				rejectUnauthorized: false,
			},
		})
	);

	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			return res.status(500).send({ msg: err });
		}
		res.status(200).send({
			message: 'Succesful. A verification email has been sent to your email.',
		});
	});
};
