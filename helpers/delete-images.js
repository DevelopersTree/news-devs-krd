const { s3 } = require('../config/index');

module.exports = async (keys = []) => {
	const deleteKeys = keys.map((k) => {
		return {
			Key: k,
		};
	});
	const params = {
		Bucket: `${process.env.AWS_BUCKET}`,
		Delete: {
			Objects: deleteKeys,
			Quiet: true,
		},
	};
	return s3.deleteObjects(params, (err, data) => {
		if (err) {
			return Promise.reject(err);
		}
		return Promise.resolve(data);
	});
};
