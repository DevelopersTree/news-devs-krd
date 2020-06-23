const express = require('express');

const router = express.Router();
const {
	create, readList, readSingle, del, upvote, update,
} = require('../queries/links');
const { createValidator, readSingleValidator, updateValidator } = require('../middlewares/links');
const paginateValidator = require('../middlewares/common/paginate');
const searchQuery = require('../middlewares/common/searchQuery');
const jwtVerify = require('../middlewares/jwtVerify');

router.get('/list', paginateValidator, searchQuery, (req, res) => {
	readList(req).then((data) => {
		res.json(data);
	}).catch((e) => {
		console.log(e)
		res.status(500).json({
			msg: 'server error',
		});
	});
});

router.get('/:link_id', readSingleValidator, (req, res) => {
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

router.delete('/:link_id', readSingleValidator, (req, res) => {
	del(req.params.link_id).then(() => {
		res.json({
			status: 1,
			msg: 'link deleted',
		});
	}).catch(() => {
		res.status(500).json({
			msg: 'server error',
		});
	});
});

router.post('/', jwtVerify, createValidator, (req, res) => {
	create(req).then((data) => {
		res.json({
			msg: 'success',
			id: data,
		});
	}).catch(() => {
		res.status(400).json({
			msg: 'bad request',
		});
	});
});

router.put('/:link_id', updateValidator, (req, res) => {
	update(req).then(() => {
		res.json({
			msg: 'success',
			id: req.params.link_id,
		});
	}).catch(() => {
		res.status(500).json({
			msg: 'server error',
		});
	});
});

// bellow link requires the publisher to be logedin
// req.publisher.id this variable should be fetched from JWT token
router.get('/:link_id/upvote', readSingleValidator, (req, res) => {
	upvote(req.publisher.id, req.params.link_id).then(() => {
		res.json({
			status: 1,
			msg: 'link upvoted',
		});
	}).catch(() => {
		res.status(500).json({
			msg: 'server error',
		});
	});
});

module.exports = router;
