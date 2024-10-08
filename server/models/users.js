const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: { 
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  moneyAmount: {
    type: Number,
    default: 0
  },
  dateCreated: Date,
  numberOfWins: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  highestMoneyWon: {
    type: Number,
    default: 0
  },
  allTimeMoneyWon: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
