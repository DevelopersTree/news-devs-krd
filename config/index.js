const AWS = require('./components/aws');

const s3 = new AWS.S3();

module.exports = {
	aws: AWS,
	s3,
};
