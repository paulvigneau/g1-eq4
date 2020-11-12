const mongoose = require('mongoose');
const Member = require('./member');
const Backlog = require('./backlog');
const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
        name: { type: String, required: true },
        description: { type: String, required: true },
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        incrUS: {type: Number, required: true, min: 0},
        members: { type: [ Member.schema ] },
        management: {
            backlog: { type: Backlog.schema }
        }
    }
);

module.exports = mongoose.model('project', ProjectSchema);
