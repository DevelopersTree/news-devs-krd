const { body, param } = require('express-validator');
const moment = require('moment');
const validate = require('./validate');
const {
	urlDataValidator, blacklistedUrlDataValidator, linkOwnership, linkUpvoteDataValidator,
} = require('../queries/validators/links');

module.exports = {
	createValidator: [
		body('title')
			.isString()
			.isLength({ min: 3 }).withMessage('invalid length '),
		body('desc')
			.isString()
			.trim()
			.isLength({ min: 0, max: 1000 })
			.withMessage('invalid length '),
		body('thumbnail')
			.optional()
			.isString()
			.trim()
			.isLength({ max: 1000000 })
			.withMessage('قه‌باره‌ی رێپێدراوی وێنه‌ نابێت له500kb كه‌متر بێت'),
		body('url')
			.isString()
			.trim()
			.isURL()
			.isLength({ min: 0, max: 500 })
			.withMessage('invalid length ')
			.custom((value) => blacklistedUrlDataValidator(value))
			.custom((value) => urlDataValidator(value)),
		body('post_date')
			.custom((value) => {
				const date = moment(value);
				if (date.isValid()) {
					return Promise.resolve(true);
				}
				return Promise.reject(new Error('invalid date format'));
			}),
		validate,
	],
	updateValidator: [
		param('link_id')
			.isInt({ gt: 0 }).withMessage('invalid link_id')
			.custom((value, { req }) => linkOwnership(value, req)),
		body('title')
			.isString()
			.isLength({ min: 3 }).withMessage('invalid length '),
		body('desc')
			.isString()
			.trim()
			.isLength({ min: 0, max: 1000 })
			.withMessage('invalid length '),
		body('thumbnail')
			.optional()
			.isString()
			.trim()
			.isLength({ max: 1000000 })
			.withMessage('قه‌باره‌ی رێپێدراوی وێنه‌ نابێت له500kb كه‌متر بێت'),
		body('original_thumbnail')
			.optional()
			.isString()
			.trim(),
		body('url')
			.isString()
			.trim()
			.isLength({ min: 0, max: 500 })
			.withMessage('invalid length ')
			.custom((value) => blacklistedUrlDataValidator(value))
			.custom((value) => urlDataValidator(value)),
		body('post_date')
			.custom((value) => {
				const date = moment(value);
				if (date.isValid()) {
					return Promise.resolve(true);
				}
				return Promise.reject(new Error('invalid date format'));
			}),
		validate,
	],
	deleteValidator: [
		param('link_id')
			.isInt({ gt: 0 }).withMessage('invalid link_id')
			.custom((value, { req }) => linkOwnership(value, req)),
		validate,
	],
	upvoteValidator: [
		param('link_id')
			.isInt({ gt: 0 }).withMessage('invalid link_id')
			.custom((value, { req }) => linkUpvoteDataValidator(value, req)),

		validate,
	],
	readSingleValidator: [
		param('link_id')
			.isInt({ gt: 0 }).withMessage('invalid link_id'),
		validate,
	],
};
