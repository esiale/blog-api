const express = require('express');
const router = express.Router();
const passport = require('passport');
const post_controller = require('../controllers/postController');
const check_admin = require('../middleware/checkAdmin');

const secure_route = passport.authenticate('jwt', { session: false });

router.get('/posts', post_controller.posts_list);
router.get('/posts/:id', post_controller.post_details);
router.post('/posts', [secure_route, check_admin], post_controller.post_create);

module.exports = router;
