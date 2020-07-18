/* eslint-disable no-param-reassign */
const express = require('express');
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');

const router = express.Router();

const { db } = require('../database/config');
const { loginValidator } = require('../middlewares/publisher');

router.post('/login', loginValidator, async (req, res) => {
	const { body } = req;
	db('publisher').select().where('username', body.username).andWhere('blocked', 0)
		.limit(1)
		.then(([step1Data]) => {
			if (step1Data) {
				const { salt } = step1Data;
				const hashedPassword = sha1(`${salt}${body.password}`);
				db('publisher').select().where('password', hashedPassword).andWhere('username', body.username)
					.limit(1)
					.then(([step2Data]) => {
						if (step2Data) {
							const token = jwt.sign({
								id: step2Data.id,
							},
							process.env.JWT_SECRET,
							{ expiresIn: '1000h' });
							step2Data.token = token;
							delete step2Data.password;
							delete step2Data.salt;
							res.status(200).json(step2Data);
						} else {
							res.status(404).json({
								status: 0,
								msg: 'تێپه‌ره‌وشه‌ یان ناوی به‌كارهێنه‌ر هه‌ڵه‌یه‌',
							});
						}
					});
			} else {
				res.status(401).json({
					msg: 'رێگه‌پێدراونیت یان به‌كارهێنه‌ر نه‌دۆزرایه‌وه‌',
				});
			}
		});
	// create(req).then((data) => {
	// 	res.json({
	// 		msg: 'success',
	// 		id: data,
	// 	});
	// }).catch(() => {
	// 	res.status(400).json({
	// 		msg: 'bad request',
	// 	});
	// });
});

module.exports = router;
