const uid = require('uniqid');
const { s3 } = require('../config/index');

module.exports = async (images = []) => {
	const imgPromises = [];
	const today = new Date();
	const year = today.getFullYear();
	const month = today.toLocaleString('default', { month: 'long' });
	images.forEach((img) => {
		imgPromises.push(new Promise((resolve, reject) => {
			const base64Data = new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');
			s3.upload({
				Bucket: `${process.env.AWS_BUCKET}/${year}/${month}`, // process.env.AWS_BUCKET
				Body: base64Data,
				Key: uid(),
				ACL: 'public-read',
				ContentEncoding: 'base64',
				ContentType: 'image/jpeg',
				CacheControl: 'max-age=31557600',
			}, (err, data) => (err == null ? resolve(data) : reject(err)));
		}));
	});
	return Promise.all(imgPromises);
};
