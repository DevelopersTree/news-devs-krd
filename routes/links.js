const express = require('express');

const router = express.Router();
const { create, readList, readSingle } = require('../queries/links');
const { createValidator, readSingleValidator } = require('../middlewares/links');
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

router.post('/', createValidator, (req, res) => {
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

module.exports = router;
