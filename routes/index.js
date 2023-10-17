const router = require('express').Router();
const users = require('./users.js');
const thoughts = require('./thoughts.js');

router.use('/users', users);
router.use('/thoughts', thoughts);

module.exports = router;