const uniqid = require('uniqid');
const sha1 = require('sha1');

const { db } = require('../database/config');

function readListQuery(limit, offset) {
	return db('publisher')
		.select()
		.limit(limit)
		.offset(offset);
}
function readSingleQuery(id) {
	return db('publisher')
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
	readPublicList: (req) => {
		const limit = req.query.limit || 10;
		const offset = req.query.offset || 0;
		return readListQuery(limit, offset).where('blocked', 0);
	},
	readSingleQuery,
	readSingle: (req) => {
		const id = req.params.publisher_id || 0;
		return readSingleQuery(id).where('blocked', 0);
	},
	create: (req) => {
		const { body } = req;
		const generatedSalt = uniqid();
		return db('publisher').insert({
			website_url: body.website_url,
			username: body.username,
			password: sha1(`${generatedSalt}${body.password}`),
			salt: generatedSalt,
			email: body.email,
			profile: body.profile,
			created_at: db.fn.now(),
		});
	},
	update: (req) => {
		const { body } = req;
		const updateObject = {
			website_url: body.website_url,
			email: body.email,
			profile: body.profile,
		};
		if (body.password) {
			const generatedSalt = uniqid();
			updateObject.password = sha1(`${generatedSalt}${body.password}`);
		}
		return db('publisher').update(updateObject).where('id', req.params.publisher_id);
	},
	block: (id) => db('publisher').update({ blocked: 1 }).where('id', id),
	unblock: (id) => db('publisher').update({ blocked: 0 }).where('id', id),
	verify: (id) => db('publisher').update({ verified: 1 }).where('id', id),
	unverify: (id) => db('publisher').update({ verified: 0 }).where('id', id),
};
