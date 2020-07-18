const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
// invalid token - synchronous
	try {
		const { authorization } = req.headers;
		const parts = (authorization) ? authorization.split(' ') : [];
		if (parts[1]) {
			try {
				const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
				req.publisher = decoded;
				next();
			} catch (err) {
				res.status(401).json({
					msg: err.toString(),
				});
			}
		} else {
			res.status(401).json({
				msg: 'invalid JWT provided',
			});
		}
	} catch (err) {
		res.status(401).json({
			msg: err.toString(),
		});
	}
};
