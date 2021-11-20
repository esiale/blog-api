const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/postController');
const setPost = require('../permissions/setPost');
const restrictPostAccess = require('../permissions/restrictPostAccess');
const restrictToRole = require('../permissions/restrictToRole');

const secureRoute = passport.authenticate('jwt', { session: false });

router.get('/posts', postController.postsList);
router.post(
  '/posts',
  [secureRoute, restrictToRole('writer')],
  postController.postCreate
);
router.get('/posts/:postId', postController.postDetails);
router.delete(
  '/posts/:postId',
  [secureRoute, setPost, restrictPostAccess],
  postController.postDelete
);
router.put(
  '/posts/:postId',
  [secureRoute, setPost, restrictPostAccess],
  postController.postUpdate
);

module.exports = router;
