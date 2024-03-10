const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const connectedUsers = new Schema({
    username: {
        type: String,
        require: true
    },
    socketId: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('connectedUsers', connectedUsers);