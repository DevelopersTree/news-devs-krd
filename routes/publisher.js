const express = require('express');

const router = express.Router();
const {
	create, readPublicList, readPopulerList, readSingle, update,
} = require('../queries/publisher');
const { createValidator, readSingleValidator, updateValidator } = require('../middlewares/publisher');
const paginateValidator = require('../middlewares/common/paginate');
const searchQuery = require('../middlewares/common/searchQuery');
const jwtVerify = require('../middlewares/jwtVerify');

router.get('/list', paginateValidator, searchQuery, (req, res) => {
	readPublicList(req).then((data) => {
		res.json(data);
	}).catch(() => {
		res.status(500).json({
			msg: 'server error',
		});
	});
});
router.get('/populer/list', paginateValidator, searchQuery, (req, res) => {
	readPopulerList(req).then((data) => {
		res.json(data);
	}).catch(() => {
		res.status(500).json({
			msg: 'server error',
		});
	});
});

router.get('/:publisher_id', readSingleValidator, (req, res) => {
	readSingle(req).then(([data]) => {
		if (data) {
			res.json(data);
		} else {
			res.status(404).json({
				msg: 'resource not found',
			});
		}
	}).catch(() => {
		res.status(500).json({
			msg: 'server error',
		});
	});
});

router.post('/', createValidator, (req, res) => {
	create(req).then((data) => {
		res.json({
			msg: 'success',
			id: data,
		});
	}).catch(() => {
		res.status(400).json({
			msg: 'Bad Request',
		});
	});
});

// this will require JWT validation
router.put('/', jwtVerify, updateValidator, (req, res) => {
	update(req).then((data) => {
		res.json({
			msg: 'success',
			data,
			id: req.params.publisher_id,
		});
	}).catch(() => {
		res.status(500).json({
			msg: 'server error',
		});
	});
});

module.exports = router;
