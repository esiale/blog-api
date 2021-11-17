const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const { auth } = require('../auth/auth');

router.post('/signup', user_controller.signup);
router.post('/login', auth);

module.exports = router;
