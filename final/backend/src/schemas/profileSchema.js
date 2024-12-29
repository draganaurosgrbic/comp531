const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    oauth_id: {
        type: String,
    },
    headline: {
        type: String,
    },
    email: {
        type: String,
    },
    zipcode: {
        type: Number,
    },
    phone: {
        type: String,
    },
    dob: {
        type: String,
    },
    avatar: {
        type: String
    },
    followedUsers: {
        type: [String]
    }
});

module.exports = profileSchema;