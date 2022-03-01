const { Schema, model } = require('mongoose');

const MyBugListSchema = new Schema({
    reporter: {
        type: String,
        required: true
    },
    command: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    server: {
        type: String,
        required: true
    }
});

module.exports = model('BugList', MyBugListSchema, 'BugList');