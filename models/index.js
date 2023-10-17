const mongoose = require('../config/db');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: 'Username is Required',
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: 'Email is Required',
    match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

const ReactionSchema = new Schema({
  reactionId: {
    type: ObjectId,
    default: () => mongoose.Types.ObjectId()
  },
  reactionBody: {
    type: String,
    required: 'Reaction is Required',
    maxLength: 280
  },
  username: {
    type: String,
    required: 'Username is Required'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => dateFormat(createdAtVal)
  }
});

const ThoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: 'Thought is Required',
    minLength: 1,
    maxLength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => dateFormat(createdAtVal)
  },
  username: {
    type: String,
    required: 'Username is Required'
  },
  reactions: [ReactionSchema]
});

ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});


const User = mongoose.model('User', UserSchema);
const Thought = mongoose.model('Thought', ThoughtSchema);
mongoose.model('Reaction', ReactionSchema);

module.exports = { User, Thought };