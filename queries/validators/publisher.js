const { db } = require('../../database/config');

module.exports = {
	usernameDataValidator: (username) => {
		const q = db('publisher').count('id as count').where('username', username).limit(1);
		return q.then(([data]) => {
			if (data.count > 0) {
				return Promise.reject(new Error('Duplicate username try another username'));
			}
			return Promise.resolve(true);
		});
	},
};
