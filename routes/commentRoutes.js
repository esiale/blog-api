const express = require('express');
const router = express.Router();
const passport = require('passport');
const commentController = require('../controllers/commentController');
const setPost = require('../permissions/setPost');
const restrictPostAccess = require('../permissions/restrictPostAccess');
const restrictToRole = require('../permissions/restrictToRole');

const secureRoute = passport.authenticate('jwt', { session: false });

router.post('/:postId/comment', commentController.commentAdd);
router.delete(
  '/:postId/comment/:commentId',
  [secureRoute, setPost, restrictPostAccess],
  commentController.commentDelete
);

module.exports = router;
