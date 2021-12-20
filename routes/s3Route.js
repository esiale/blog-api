const express = require('express');
const router = express.Router();
const passport = require('passport');
const restrictToRole = require('../permissions/restrictToRole');
const aws = require('aws-sdk');

const secureRoute = passport.authenticate('jwt', { session: false });

router.post(
  '/sign-s3',
  [secureRoute, restrictToRole('writer')],
  (req, res, next) => {
    const { name, type } = req.body;
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      accessAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-central-1',
    });
    const s3 = new aws.S3();
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Expires: 60,
      Conditions: [
        ['content-length-range', 100, 5242880],
        { 'Content-Type': 'image/jpeg' },
      ],
      Fields: {
        key: `blog/${name}`,
        'Content-Type': type,
        success_action_status: '201',
      },
    };

    s3.createPresignedPost(s3Params, (err, data) => {
      if (err) {
        return next({ status: 500, message: err.message });
      }
      return res.json(data);
    });
  }
);

module.exports = router;
