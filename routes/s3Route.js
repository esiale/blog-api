const express = require('express');
const router = express.Router();
const passport = require('passport');
const restrictToRole = require('../permissions/restrictToRole');
const s3Client = require('../config/s3');
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');

const secureRoute = passport.authenticate('jwt', { session: false });

router.post(
  '/sign-s3',
  [secureRoute, restrictToRole('writer')],
  async (req, res, next) => {
    const { name, type } = req.body;
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
      const data = await createPresignedPost(s3Client, params);
      return res.json(data);
    } catch (err) {
      return next({ status: 500, message: err.message });
    }
  }
);

module.exports = router;
