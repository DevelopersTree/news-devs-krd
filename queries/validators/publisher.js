const { db } = require('../../database/config');

module.exports = {
	usernameDataValidator: (username) => {
		const q = db('publisher').count('id as count').where('username', username).limit(1);
		return q.then(([data]) => {
			if (data.count > 0) {
				return Promise.reject(new Error('ناوی به‌كارهێنه‌ر هه‌یه‌ ناوێكی دیكه‌ تاقی بكه‌وه‌'));
			}
			return Promise.resolve(true);
		});
	},
};
