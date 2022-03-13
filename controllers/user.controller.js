const User = require('../models/user.model');

exports.getProfile = async (req, res, next) => {
	try {
		const id = req.userId;
		const user = await User.findById(id).select('-__v -password');
		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			});
		}
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};
