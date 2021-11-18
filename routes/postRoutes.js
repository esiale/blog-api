const express = require('express');
const router = express.Router();
const post_controller = require('../controllers/postController');

router.get('/posts', post_controller.posts_list);
router.get('/posts/:id', post_controller.post_details);

module.exports = router;
