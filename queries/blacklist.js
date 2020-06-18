const { db } = require('../database/config');

function readListQuery(limit, offset) {
	return db('blacklist')
		.select()
		.limit(limit)
		.offset(offset);
}
function readSingleQuery(id) {
	return db('blacklist')
		.select()
		.where('id', id)
		.limit(1);
}

module.exports = {
	readListQuery,
	readList: (req) => {
		const limit = req.query.limit || 10;
		const offset = req.query.offset || 0;
		return readListQuery(limit, offset);
	},
	readSingleQuery,
	readSingle: (req) => {
		const id = req.params.link_id || 0;
		return readSingleQuery(id);
	},
	create: (req) => {
		const { body } = req;
		return db('blacklist').insert({
			url: body.url,
			created_at: db.fn.now(),
		});
	},
	del: (id) => db('blacklist').del().where('id', id),
};
