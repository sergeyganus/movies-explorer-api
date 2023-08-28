const router = require('express').Router();
const { logout } = require('../controllers/auth');

router.post('/signout', logout);

module.exports = router;
