const express = require('express');
const router = express.Router();
const passport = require('passport');
const restrictToRole = require('../permissions/restrictToRole');
const aws = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const secureRoute = passport.authenticate('jwt', { session: false });

router.get(
  '/sign-s3',
  [secureRoute, restrictToRole('writer')],
  (req, res, next) => {
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      accessAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-central-1',
    });

    const s3 = new aws.S3();
    const fileType = req.query['file-type'];
    const fileName = uuidv4();
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        return next({ status: 500, message: err.message });
      }
      const returnData = {
        fileName: fileName,
        signedRequest: data,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
      };
      return res.json(returnData);
    });
  }
);

module.exports = router;
