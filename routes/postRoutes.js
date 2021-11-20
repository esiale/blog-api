const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/postController');
const checkAdmin = require('../middleware/checkAdmin');

const secureRoute = passport.authenticate('jwt', { session: false });

router.get('/posts', postController.postsList);
router.post('/posts', [secureRoute, checkAdmin], postController.postCreate);
router.get('/posts/:id', postController.postDetails);
router.delete(
  '/posts/:id',
  [secureRoute, checkAdmin],
  postController.postDelete
);
router.put('/posts/:id', [secureRoute, checkAdmin], postController.postUpdate);

module.exports = router;
