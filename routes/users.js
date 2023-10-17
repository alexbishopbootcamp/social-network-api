const router = require('express').Router();
const { User } = require('../models');

// GET all users
router.get('/', (req, res) => {
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

// GET user by ID
router.get('/:id', (req, res) => {
  console.log("Got a request for a user by ID")
  User.findOne({ _id: req.params.id })
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this ID!' });
        return;
      }
      res.json(dbUserData)
    })
    .catch(err => res.status(400).json(err));
});

// POST a new user
router.post('/', (req, res) => {
  console.log("Got a request to create a new user")
  const newUser = {
    username: req.body.username,
    email: req.body.email
  };
  User.create(newUser)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
});

// PUT update a user by ID
router.put('/:id', (req, res) => {
  console.log("Got a request to update a user by ID")
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      username: req.body.username,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this ID!' });
        return;
      }
      res.json(dbUserData)
    })
    .catch(err => res.status(400).json(err));
});

// DELETE a user by ID
router.delete('/:id', (req, res) => {
  console.log("Got a request to delete a user by ID");
  User.findOneAndDelete({ _id: req.params.id })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this ID!" });
        return;
      }
      // Remove all thoughts associated with this user
      return Thought.deleteMany({ username: dbUserData.username });
    })
    .then(() => {
      res.json({ message: "User and associated thoughts deleted!" });
    })
    .catch(err => res.status(400).json(err));
});


// POST add friend to friends list
router.post('/:userId/friends/:friendId', (req, res) => {
  console.log("Got a request to add a friend to a user's friends list")
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $push: { friends: req.params.friendId } },
    { new: true }
  )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this ID!" });
        return;
      }
      res.json(dbUserData)
    })
    .catch(err => res.status(400).json(err));
});

// DELETE remove friend from friends list
router.delete('/:userId/friends/:friendId', (req, res) => {
  console.log("Got a request to remove a friend from a user's friends list")
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { new: true }
  )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this ID!" });
        return;
      }
      res.json(dbUserData)
    })
    .catch(err => res.status(400).json(err));
});


module.exports = router;