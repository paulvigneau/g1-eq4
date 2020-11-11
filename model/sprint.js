const mongoose = require('mongoose');
const UserStory = require('./user-story');
const Schema = mongoose.Schema;

let SprintSchema = new Schema({
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        USList: [ UserStory.schema ]
    }
);

module.exports = mongoose.model('sprint', SprintSchema);
