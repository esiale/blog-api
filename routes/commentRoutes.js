const express = require('express');
const router = express.Router();
const passport = require('passport');
const comment_controller = require('../controllers/commentController');
const check_admin = require('../middleware/checkAdmin');

const secure_route = passport.authenticate('jwt', { session: false });

router.post('/:id/comment', comment_controller.comment_add);
router.delete('/:postId/comment/:commentId', comment_controller.comment_delete);

module.exports = router;
