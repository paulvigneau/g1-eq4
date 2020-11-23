const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

let UserStorySchema = new Schema({
        id: { type: Number, required: true, min: 0 },
        description: { type: String, required: true },
        difficulty: { type: Number, required: true, enum: [ 1, 2, 3, 5 ] },
        priority: { type: Number, required: true, min: 0 },
        status: { type: String, default: 'Normal', enum: ['Frozen', 'Normal']},
        parent: { type: ObjectId, default: null },
        label: {type: String, default: null }
    }
);

module.exports = mongoose.model('user-story', UserStorySchema);
