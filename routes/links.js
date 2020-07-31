const express = require('express');

const router = express.Router();
const {
	create, readList, readSingle, del, upvote, update,
} = require('../queries/links');
const {
	createValidator,
	readSingleValidator,
	updateValidator,
	upvoteValidator,
	deleteValidator,
} = require('../middlewares/links');
const paginateValidator = require('../middlewares/common/paginate');
const searchQuery = require('../middlewares/common/searchQuery');
const jwtVerify = require('../middlewares/jwtVerify');

router.get('/list', paginateValidator, searchQuery, (req, res) => {
	readList(req).then((data) => {
		res.json(data);
	}).catch(() => {
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

router.delete('/:link_id', jwtVerify, deleteValidator, (req, res) => {
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

router.put('/:link_id', jwtVerify, updateValidator, (req, res) => {
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

router.post('/:link_id/upvote', jwtVerify, upvoteValidator, (req, res) => {
	upvote(req.publisher.id, req.params.link_id).then(() => {
		res.json({
			status: 1,
			msg: 'ده‌نگ درا',
		});
	}).catch(() => {
		res.status(500).json({
			msg: 'server error',
		});
	});
});

module.exports = router;
