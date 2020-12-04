const mongoose = require('mongoose');
const Member = require('./memberModel');
const Backlog = require('./backlogModel');
const Dod = require('./dodModel');
const Task = require('./taskModel');
const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
        name: { type: String, required: true },
        description: { type: String, required: true },
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        incrUS: { type: Number, required: true, min: 0, default: 0 },
        members: { type: [ Member.schema ] },
        dod: { type: Dod.schema, default: new Dod() },
        management: {
            backlog: { type: Backlog.schema, default: new Backlog() },
            tasks: {
                todo: {type: [Task.schema] },
                wip: {type: [Task.schema] },
                done: {type: [Task.schema] }
            }
        }
    }
);

module.exports = mongoose.model('project', ProjectSchema);
