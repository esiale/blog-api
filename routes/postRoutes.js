const express = require('express');
const router = express.Router();
const passport = require('passport');
const post_controller = require('../controllers/postController');
const check_admin = require('../middleware/checkAdmin');

const secure_route = passport.authenticate('jwt', { session: false });

router.get('/posts', post_controller.posts_list);
router.post('/posts', [secure_route, check_admin], post_controller.post_create);
router.get('/posts/:id', post_controller.post_details);
router.delete(
  '/posts/:id',
  [secure_route, check_admin],
  post_controller.post_delete
);
router.put(
  '/posts/:id',
  [secure_route, check_admin],
  post_controller.post_update
);

module.exports = router;
