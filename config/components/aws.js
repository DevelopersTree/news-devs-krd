const AWS = require('aws-sdk');

AWS.config.update({
	endpoint: process.env.AWS_ENDPOINT,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// const s3 = new AWS.S3();
// async function testfunction() {
// 	//   var params = {
// 	//     Bucket: "kurd-cars",
// 	//     Key: "2020/testimage"
// 	//    };
// 	//    s3.getObject(params, function(err, data) {
// 	//      if (err){
// 	//         console.log(err.statusCode);
// 	//      } // an error occurred
// 	//      else{
// 	//          console.log(data.Body.toString())
// 	//      }         // successful response
// 	//      /*
// 	//      data = {
// 	//       AcceptRanges: "bytes",
// 	//       ContentLength: 3191,
// 	//       ContentType: "image/jpeg",
// 	//       ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
// 	//       LastModified: <Date Representation>,
// 	//       Metadata: {
// 	//       },
// 	//       TagCount: 2,
// 	//       VersionId: "null"
// 	//      }
// 	//      */
// 	//    });

// }
module.exports = AWS;
