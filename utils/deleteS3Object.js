const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const AmazonS3URI = require('amazon-s3-uri');
const s3Client = require('../config/s3');

const deleteS3Object = async (objectUri) => {
  const { key } = AmazonS3URI(objectUri);
  try {
    const response = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
    );
    return response;
  } catch (err) {
    return next({ status: err.Code, message: err.Message });
  }
};

module.exports = deleteS3Object;
