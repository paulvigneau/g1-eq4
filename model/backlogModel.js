const mongoose = require('mongoose');
const UserStory = require('./userStoryModel');
const Sprint = require('./sprintModel');
const Schema = mongoose.Schema;

let BacklogSchema = new Schema({
        backlog: {
            USList: { type: [ UserStory.schema ] }
        },
        sprints: { type: [ Sprint.schema ] }
    }
);

module.exports = mongoose.model('backlog', BacklogSchema);
