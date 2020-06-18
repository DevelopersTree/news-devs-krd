const { body, param } = require('express-validator');
const moment = require('moment');
const validate = require('./validate');
const { urlDataValidator, blacklistedUrlDataValidator } = require('../queries/validators/links');

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
			.isString()
			.trim()
			.isLength({ min: 0, max: 500 })
			.withMessage('invalid length '),
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
		body('publisher_id')
			.isInt({ gt: 0 }).withMessage('invalid publisher_id'),

		validate,
	],
	updateValidator: [
		param('link_id')
			.isInt({ gt: 0 }).withMessage('invalid link_id'),
		body('title')
			.isString()
			.isLength({ min: 3 }).withMessage('invalid length '),
		body('desc')
			.isString()
			.trim()
			.isLength({ min: 0, max: 1000 })
			.withMessage('invalid length '),
		body('thumbnail')
			.isString()
			.trim()
			.isLength({ min: 0, max: 500 })
			.withMessage('invalid length '),
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
	readSingleValidator: [
		param('link_id')
			.isInt({ gt: 0 }).withMessage('invalid link_id'),
		validate,
	],
};
