const express = require('express');
const router = express.Router();
const passport = require('passport');
const commentController = require('../controllers/commentController');
const checkAdmin = require('../middleware/checkAdmin');

const secureRoute = passport.authenticate('jwt', { session: false });

router.post('/:id/comment', commentController.commentAdd);
router.delete('/:postId/comment/:commentId', commentController.commentDelete);

module.exports = router;
