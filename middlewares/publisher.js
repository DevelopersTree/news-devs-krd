const { body, param } = require('express-validator');
const validate = require('./validate');
const { usernameDataValidator } = require('../queries/validators/publisher');

module.exports = {
	createValidator: [
		body('website_url')
			.exists()
			.isString()
			.isLength({ min: 0 })
			.withMessage('invalid length '),
		body('username')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 35 })
			.withMessage('invalid length ')
			.custom((value) => usernameDataValidator(value)),
		body('password')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 45 })
			.withMessage('invalid length '),
		body('password_retype')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 45 })
			.withMessage('invalid length ')
			.custom((value, { req }) => {
				const { password } = req.body;
				if (value === password && password && value) {
					return Promise.resolve(true);
				}
				return Promise.reject(new Error('invalid password retype password doesnt match'));
			}),
		body('email')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 500 })
			.withMessage('invalid length '),
		body('profile')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 500 })
			.withMessage('invalid length '),
		validate,
	],
	updateValidator: [
		param('publisher_id')
			.exists()
			.isInt({ gt: 0 }).withMessage('invalid publisher_id'),
		body('website_url')
			.exists()
			.isString()
			.isLength({ min: 0 })
			.withMessage('invalid length '),
		body('password')
			.optional()
			.isString()
			.trim()
			.isLength({ min: 0, max: 45 })
			.withMessage('invalid length '),
		body('password_retype')
			.optional()
			.isString()
			.trim()
			.isLength({ min: 0, max: 45 })
			.withMessage('invalid length ')
			.custom((value, { req }) => {
				const { password } = req.body;
				if (value === password && password && value) {
					return Promise.resolve(true);
				}
				return Promise.reject(new Error('invalid password retype password doesnt match'));
			}),
		body('email')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 500 })
			.withMessage('invalid length '),
		body('profile')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 500 })
			.withMessage('invalid length '),
		validate,
	],
	loginValidator: [
		body('username')
			.exists()
			.isString()
			.isLength({ min: 0 })
			.withMessage('invalid length '),
		body('password')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 45 })
			.withMessage('invalid length '),
		validate,
	],
	readSingleValidator: [
		param('publisher_id')
			.exists()
			.isInt({ gt: 0 }).withMessage('invalid publisher_id'),
		validate,
	],
};
