const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    oauth_id: {
        type: String,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
    },
});

module.exports = userSchema;