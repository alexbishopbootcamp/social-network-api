const router = require('express').Router();
const { User, Thought } = require('../models');

// GET all thoughts
router.get('/', (req, res) => {
  console.log("Got a request for thoughts")
  Thought.find({})
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .select('-__v')
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.status(400).json(err));
});

// GET thought by ID
router.get('/:id', (req, res) => {
  console.log("Got a request for a thought by ID")
  Thought.findOne({ _id: req.params.id })
    .populate({
      path: 'reactions',
      select: '-__v'
    })
    .select('-__v')
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this ID!' });
        return;
      }
      res.json(dbThoughtData)
    })
    .catch(err => res.status(400).json(err));
});

// POST a new thought
router.post('/', (req, res) => {
  console.log("Got a request to create a new thought")
  const newThought = {
    thoughtText: req.body.thoughtText,
    username: req.body.username
  };
  Thought.create(newThought)
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      // Add thought to user's thoughts array
      User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      )
      .then(dbThoughtData => {
        res.json(dbThoughtData)
      })
    })
    .catch(err => {
      console.log("Error posting thought: ", err);
      res.status(400).json(err)
    });
});

// PUT update a thought by ID
router.put('/:id', (req, res) => {
  console.log("Got a request to update a thought by ID")
  Thought.findOneAndUpdate(
    { _id: req.params.id },
    {
      thoughtText: req.body.thoughtText,
      username: req.body.username
    },
    {
      new: true,
      runValidators: true
    }
  )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this ID!' });
        return;
      }
      res.json(dbThoughtData)
    })
    .catch(err => res.status(400).json(err));
});

// DELETE a thought by ID
router.delete('/:id', (req, res) => {
  console.log("Got a request to delete a thought by ID");
  Thought.findOneAndDelete({ _id: req.params.id })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this ID!" });
        return;
      }
      // Remove thought from user's thoughts array
      return User.findOneAndUpdate(
        { username: dbThoughtData.username },
        { $pull: { thoughts: req.params.id } },
        { new: true }
      );
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this ID!" });
        return;
      }
      res.json({ message: "Thought and associated reactions deleted!" });
    })
    .catch(err => res.status(400).json(err));
});


// POST add reaction to reactions list
router.post('/:thoughtId/reactions', (req, res) => {
  console.log("Got a request to add a reaction to a thought's reactions list");
  // Create a new Reaction document
  const reaction = {
    reactionBody: req.body.reactionBody,
    username: req.body.username
  };

  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $push: { reactions: reaction } },
    { new: true }
  )
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      res.status(404).json({ message: "No thought found with this ID!" });
      return;
    }
    res.json(dbThoughtData);
  })
  .catch(err => res.status(400).json(err));
});


// DELETE remove reaction from reactions list
router.delete('/:thoughtId/reactions/:reactionId', (req, res) => {
  console.log("Got a request to remove a reaction from a thought's reactions list");
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { _id: req.params.reactionId } } },
    { new: true }
  )
  .then(dbThoughtData => {
    if (!dbThoughtData) {
      res.status(404).json({ message: "No thought found with this ID!" });
      return;
    }
    res.json(dbThoughtData);
  })
  .catch(err => res.status(400).json(err));
});

module.exports = router;