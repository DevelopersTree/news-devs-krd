/* eslint-disable prefer-destructuring */
const { db } = require('../../database/config');
const { readSingleQuery } = require('./../links');

function extractHostname(url) {
	let hostname;
	// find & remove protocol (http, ftp, etc.) and get hostname

	if (url.indexOf('//') > -1) {
		hostname = url.split('/')[2];
	} else {
		hostname = url.split('/')[0];
	}

	// find & remove port number
	[hostname] = hostname.split(':');
	// find & remove "?"
	[hostname] = hostname.split('?');

	return hostname;
}
module.exports = {
	urlDataValidator: (url) => {
		const q = db('links').count('id as count').where('url', 'LIKE', url).limit(1);
		return q.then(([data]) => {
			if (data.count > 0) {
				return Promise.reject(new Error('Duplicate link found'));
			}
			return Promise.resolve(true);
		});
	},
	blacklistedUrlDataValidator: (url) => {
		const q = db('blacklist').count('id as count').where('url', 'LIKE', `%${extractHostname(url)}%`).limit(1);
		return q.then(([data]) => {
			if (data.count > 0) {
				return Promise.reject(new Error('Blacklisted link found'));
			}
			return Promise.resolve(true);
		});
	},
	linkOwnership: async (value, req)=>{
		const [link]  = await readSingleQuery(value);
		if(link){
			if(link.publisher_id == req.publisher.id){
				return Promise.resolve(true);
			}
			return Promise.reject(new Error('you are not the owner for this link'))
		}
		return Promise.reject(new Error('link was not found'))
	},
	linkUpvoteDataValidator: async (value, req)=>{
		const [record]  = await db('link_votes').count('id as count').where('publisher_id', req.publisher.id).andWhere('link_id', value).limit(1);
		if(record.count > 0){
			return Promise.reject(new Error('you already voted this link'))
		}
		return Promise.resolve(true);
	}
};
