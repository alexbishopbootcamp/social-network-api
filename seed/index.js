const { User, Thought } = require('../models');

const newUser = new User({
  username: 'username',
  email: 'email@domain.tld'
});

const newThought = new Thought({
  thoughtText: 'Thought',
  username: 'username'
});

const seed = async () => {
  await User.deleteMany({});
  await Thought.deleteMany({});
  await newUser.save();
  await newThought.save();
  await User.updateOne(
    { _id: newUser._id },
    { $push: { thoughts: newThought._id } }
  );
  process.exit(0);
}

seed();