const express = require('express');

const router = express.Router();
const {
	create, readList, readSingle, update,
} = require('../queries/publisher');
const { createValidator, readSingleValidator, updateValidator } = require('../middlewares/publisher');
const paginateValidator = require('../middlewares/common/paginate');
const searchQuery = require('../middlewares/common/searchQuery');

router.get('/list', paginateValidator, searchQuery, (req, res) => {
	readList(req).then((data) => {
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
	}).catch((e) => {
		res.status(400).json({
			msg: 'bad request',
		});
	});
});

// this will require JWT validation
router.put('/:publisher_id', updateValidator, (req, res) => {
	update(req).then(() => {
		res.json({
			msg: 'success',
			id: req.params.publisher_id,
		});
	}).catch(() => {
		res.status(500).json({
			msg: 'server error',
		});
	});
});

module.exports = router;
