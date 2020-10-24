const uniqid = require('uniqid');
const sha1 = require('sha1');

const uploader = require('../helpers/upload-images');
const imgRemover = require('../helpers/delete-images');

const { db } = require('../database/config');

function readListQuery(limit, offset) {
	return db('publisher')
		.select('publisher.id', 'username', 'profile', 'website_url', 'uid', 'email',
			'verified', 'rssfeed_url', 'display_name',
			'publisher.created_at')
		.limit(limit)
		.offset(offset);
}
function readSingleQuery(id) {
	return db('publisher')
		.select('id', 'username', 'profile', 'website_url', 'uid', 'email',
			'verified', 'created_at', 'rssfeed_url', 'display_name')
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
// 	readPopulerList: (req) => {
// 		const limit = req.query.limit || 10;
// 		const offset = req.query.offset || 0;
// 		return readListQuery(limit, offset)
// 			.leftJoin('links', 'publisher.id', 'links.publisher_id')
// 			.groupBy('publisher.id')
// 			.orderByRaw('COUNT(links.id) desc')
// 			.where('blocked', 0);
// 	},
	readPopulerList: (req) => {
		const limit = req.query.limit || 10;
		const offset = req.query.offset || 0;
		return db.raw(`
			SELECT 
				publisher_id,
				COUNT(links.id) as link_count,
				publisher.id,
				display_name,
				profile,
				website_url,
				rssfeed_url,
				email,
				verified

			FROM links,publisher 
			WHERE links.publisher_id=publisher.id AND 
				  publisher.blocked = 0

			GROUP BY 
				publisher_id,
				publisher.id,
				display_name,
				profile,
				website_url,
				rssfeed_url,
				email,
				verified
			ORDER BY COUNT(links.id) desc
			LIMIT 10
		`).then(([data])=> data );
	},
	readSingleQuery,
	readSingle: (req) => {
		const id = req.params.publisher_id || 0;
		return readSingleQuery(id).where('blocked', 0);
	},
	create: async (req) => {
		const { body } = req;
		const generatedSalt = uniqid();
		const insertObject = {
			website_url: body.website_url,
			rssfeed_url: body.rssfeed_url,
			display_name: body.display_name,
			username: body.username,
			password: sha1(`${generatedSalt}${body.password}`),
			salt: generatedSalt,
			email: body.email,
			created_at: db.fn.now(),
		};
		let profileRequests = [{}];
		if (body.profile !== undefined && body.profile !== '') {
			const promises = [uploader([body.profile])];
			profileRequests = await Promise.all(promises);
			// eslint-disable-next-line prefer-destructuring
			profileRequests = profileRequests[0];
			insertObject.profile = `${profileRequests[0].key}` || '';
		}
		return db('publisher').insert(insertObject);
	},
	update: async (req) => {
		const { body } = req;
		const updateObject = {
			website_url: body.website_url,
			rssfeed_url: body.rssfeed_url,
			display_name: body.display_name,
			email: body.email,
		};
		if (body.password) {
			const generatedSalt = uniqid();
			updateObject.password = sha1(`${generatedSalt}${body.password}`);
			updateObject.salt = generatedSalt;
		}

		let profileRequests = [{}];
		if (body.profile !== undefined && body.profile !== '') {
			const promises = [uploader([body.profile])];
			if (body.original_profile) {
				promises.push(imgRemover([body.original_profile]));
			}
			profileRequests = await Promise.all(promises);
			// eslint-disable-next-line prefer-destructuring
			profileRequests = profileRequests[0];
			updateObject.profile = `${profileRequests[0].key}` || '';
		}
		return db('publisher').update(updateObject).where('id', req.publisher.id).then(async () => {
			const [publisher] = await db('publisher')
				.select('id', 'username', 'profile', 'website_url', 'uid', 'email', 'rssfeed_url', 'display_name', 'created_at')
				.where('id', req.publisher.id).limit(1);
			return publisher;
		});
	},
	block: (id) => db('publisher').update({ blocked: 1 }).where('id', id),
	unblock: (id) => db('publisher').update({ blocked: 0 }).where('id', id),
	verify: (id) => db('publisher').update({ verified: 1 }).where('id', id),
	unverify: (id) => db('publisher').update({ verified: 0 }).where('id', id),
};
