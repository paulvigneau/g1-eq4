const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

let TaskSchema = new Schema({
        description: { type: String, required: true },
        type: { type: String, required: true, enum: [ 'GEN', 'DEV', 'TEST' ] },
        cost: { type: Number, required: true },
        status: { type: String, required: true, enum: [ 'TODO', 'WIP', 'DONE' ] },
        checklist: { type: [ Boolean ], required: true, default: [] },
        member: { type: ObjectId },
        USList: { type: [ ObjectId ] },
        dependencies: { type: [ ObjectId ]  },
    }
);

module.exports = mongoose.model('task', TaskSchema);

