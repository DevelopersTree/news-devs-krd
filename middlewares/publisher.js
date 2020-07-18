const { body, param } = require('express-validator');
const validate = require('./validate');
const { usernameDataValidator } = require('../queries/validators/publisher');

module.exports = {
	createValidator: [
		body('website_url')
			.exists()
			.isString()
			.isLength({ min: 0 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌'),
		body('username')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 35 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌')
			.custom((value) => usernameDataValidator(value)),
		body('password')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 45 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌'),
		body('password_retype')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 45 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌')
			.custom((value, { req }) => {
				const { password } = req.body;
				if (value === password && password && value) {
					return Promise.resolve(true);
				}
				return Promise.reject(new Error('هه‌ڵه‌ له‌ تێپه‌ره‌وشه‌ و دوباره‌كردنه‌وه‌كه‌ی له‌یه‌ك ناچن'));
			}),
		body('email')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 500 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌'),
		body('profile')
			.optional()
			.isString()
			.trim(),
		validate,
	],
	updateValidator: [
		// param('publisher_id')
		// 	.exists()
		// 	.isInt({ gt: 0 }).withMessage('invalid publisher_id'),
		body('website_url')
			.exists()
			.isString()
			.isLength({ min: 0 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌'),
		body('password')
			.optional()
			.isString()
			.trim()
			.isLength({ min: 0, max: 45 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌'),
		body('password_retype')
			.optional()
			.isString()
			.trim()
			.isLength({ min: 0, max: 45 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌')
			.custom((value, { req }) => {
				const { password } = req.body;
				if (value === password && password && value) {
					return Promise.resolve(true);
				}
				return Promise.reject(new Error('هه‌ڵه‌ له‌ تێپه‌ره‌وشه‌ و دوباره‌كردنه‌وه‌كه‌ی له‌یه‌ك ناچن'));
			}),
		body('email')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 500 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌'),
		body('original_profile')
			.optional()
			.isString()
			.trim(),
		body('profile')
			.optional()
			.isString()
			.trim(),
		validate,
	],
	loginValidator: [
		body('username')
			.exists()
			.isString()
			.isLength({ min: 0 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌'),
		body('password')
			.exists()
			.isString()
			.trim()
			.isLength({ min: 0, max: 45 })
			.withMessage('ژماره‌ی پیته‌كان هه‌ڵه‌یه‌'),
		validate,
	],
	readSingleValidator: [
		param('publisher_id')
			.exists()
			.isInt({ gt: 0 }).withMessage('invalid publisher_id'),
		validate,
	],
};
