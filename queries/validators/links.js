/* eslint-disable prefer-destructuring */
const { db } = require('../../database/config');

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
};
