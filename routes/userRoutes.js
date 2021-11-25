const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const setUser = require('../permissions/setUser');
const restrictToRole = require('../permissions/restrictToRole');
const restrictUserAccess = require('../permissions/restrictUserAccess');

const secureRoute = passport.authenticate('jwt', { session: false });

router.get(
  '/',
  [secureRoute, restrictToRole('writer')],
  userController.usersList
);
router.get(
  '/:userId',
  [secureRoute, restrictToRole('writer')],
  userController.userDetails
);
router.put(
  '/:userId',
  [secureRoute, setUser, restrictUserAccess],
  userController.userUpdate
);
router.delete(
  '/:userId',
  [secureRoute, restrictToRole('admin')],
  userController.userDelete
);

module.exports = router;
