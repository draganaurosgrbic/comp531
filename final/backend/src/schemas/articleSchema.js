const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    pid: {
        type: Number,
    },
    date: {
        type: Date,
    },
    author: {
        type: String,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    comments: {
        type: Array,
    }
});

module.exports = articleSchema;