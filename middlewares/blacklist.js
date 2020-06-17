const { body, param } = require('express-validator');
const validate = require('./validate');

module.exports = {
  createValidator: [
    body('url')
      .isString()
      .trim()
      .isLength({ min: 0, max: 500 })
      .withMessage('invalid length '),
    validate,
  ],
  readSingleValidator: [
    param('blacklist_link_id')
      .isInt({ gt: 0 }).withMessage('invalid blacklist_link_id'),
    validate,
  ],
};
