const mongoose = require('mongoose');
const UserStory = require('./user-story');
const Sprint = require('./sprint');
const Schema = mongoose.Schema;

let BacklogSchema = new Schema({
        backlog: {
            USList: { type: [ UserStory.schema ] }
        },
        sprints: { type: [ Sprint.schema ] }
    }
);

module.exports = mongoose.model('backlog', BacklogSchema);
