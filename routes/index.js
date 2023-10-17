const router = require('express').Router();
const { User, Thought } = require('../models');

// GET all users
router.get('/users', (req, res) => {
  console.log("Got a request for users")
  User.find({})
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
});



module.exports = router;