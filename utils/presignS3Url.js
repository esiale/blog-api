const { HttpRequest } = require('@aws-sdk/protocol-http');
const { S3RequestPresigner } = require('@aws-sdk/s3-request-presigner');
const { parseUrl } = require('@aws-sdk/url-parser');
const { Hash } = require('@aws-sdk/hash-node');
const { formatUrl } = require('@aws-sdk/util-format-url');

const presignS3Url = async (url) => {
  const s3ObjectUrl = parseUrl(url);
  const presigner = new S3RequestPresigner({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'eu-central-1',
    sha256: Hash.bind(null, 'sha256'),
  });
  const presigned = await presigner.presign(new HttpRequest(s3ObjectUrl));
  return formatUrl(presigned);
};

module.exports = presignS3Url;
