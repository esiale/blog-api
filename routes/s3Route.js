const express = require('express');
const router = express.Router();
const passport = require('passport');
const restrictToRole = require('../permissions/restrictToRole');
const { S3Client } = require('@aws-sdk/client-s3');
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');

const secureRoute = passport.authenticate('jwt', { session: false });

router.post(
  '/sign-s3',
  [secureRoute, restrictToRole('writer')],
  async (req, res, next) => {
    const { name, type } = req.body;
    const client = new S3Client({
      region: 'eu-central-1',
    });
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Expires: 60,
      Conditions: [
        ['content-length-range', 100, 5242880],
        { 'Content-Type': 'image/jpeg' },
      ],
      Fields: {
        'Content-Type': type,
        success_action_status: '201',
      },
      Key: `${name}`,
    };
    try {
      const data = await createPresignedPost(client, params);
      return res.json(data);
    } catch (err) {
      return next({ status: 500, message: err.message });
    }
  }
);

module.exports = router;
