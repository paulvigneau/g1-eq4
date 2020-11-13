const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

let UserStorySchema = new Schema({
        id: { type: Number, required: true, min: 0 },
        description: { type: String, required: true },
        difficulty: { type: Number, required: true, min: 0 },
        priority: { type: Number, required: true, min: 0 },
        status: { type: Number, default: null },
        parent: { type: ObjectId, default: null }
    }
);

module.exports = mongoose.model('user-story', UserStorySchema);
