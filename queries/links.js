const { db } = require('../database/config');

const uploader = require('../helpers/upload-images');
const imgRemover = require('../helpers/delete-images');

function readListQuery(limit, offset) {
	return db('links')
		.select('links.*', 'publisher.username as publisher_name', 'publisher.username as publisher_name')
		.leftJoin('publisher', 'publisher.id', 'publisher_id')
		.where('publisher.blocked', 0)
		.limit(limit)
		.offset(offset);
}
function readSingleQuery(id) {
	return db('links')
		.select('links.*', 'publisher.username as publisher_name')
		.leftJoin('publisher', 'publisher.id', 'publisher_id')
		.where('publisher.blocked', 0)
		.andWhere('links.id', id)
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
	create: async (req) => {
		const { body } = req;
		const insertObject = {
			title: body.title,
			desc: body.desc,
			url: body.url,
			publisher_id: req.publisher.id,
			post_date: body.post_date,
			created_at: db.fn.now(),
		};
		let thumbnailRequests = [{}];
		if (body.thumbnail !== undefined && body.thumbnail !== '') {
			const promises = [uploader([body.thumbnail])];
			thumbnailRequests = await Promise.all(promises);
			// eslint-disable-next-line prefer-destructuring
			thumbnailRequests = thumbnailRequests[0];
			insertObject.thumbnail = `${thumbnailRequests[0].key}` || '';
		}

		return db('links').insert(insertObject);
	},
	update: async (req) => {
		const { body } = req;
		const updateObject = {
			title: body.title,
			desc: body.desc,
			url: body.url,
			post_date: body.post_date,
		};
		let thumbnailRequests = [{}];
		if (body.thumbnail !== undefined && body.thumbnail !== '') {
			const promises = [uploader([body.thumbnail])];
			if (body.original_thumbnail) {
				promises.push(imgRemover([body.original_thumbnail]));
			}
			thumbnailRequests = await Promise.all(promises);
			// eslint-disable-next-line prefer-destructuring
			thumbnailRequests = thumbnailRequests[0];
			updateObject.thumbnail = `${thumbnailRequests[0].key}` || '';
		}
		return db('links').update(updateObject).where('id', req.params.link_id);
	},
	del: (id) => db('links').del().where('id', id),

	upvote: (publisherId, linkId) => {
		return db('link_votes').insert({
			publisher_id: publisherId,
			link_id: linkId,
			created_at: db.fn.now(),
		}).then(() => {
			return db.raw('UPDATE links SET up_votes = up_votes+1 WHERE id=?', [linkId]).then(() => {
				return {
					publisher_id: publisherId,
					link_id: linkId,
					msg: 'link is voted',
				};
			});
		});
	},
};
