const { User, Thought } = require('../models');

const newUser = new User({
  username: 'Alice',
  email: 'email@domain.tld'
});

const newThought = new Thought({
  thoughtText: 'I think MongoDB is great!',
  username: 'Alice'
});

const newReaction = {
  reactionBody: 'I agree!',
  username: 'Bob'
};

const seed = async () => {
  await User.deleteMany({});
  await Thought.deleteMany({});
  await newUser.save();
  await newThought.save();
  await User.updateOne(
    { _id: newUser._id },
    { $push: { thoughts: newThought._id } }
  );
  await Thought.updateOne(
    { _id: newThought._id },
    { $push: { reactions: newReaction } }
  );
  process.exit(0);
}

seed();