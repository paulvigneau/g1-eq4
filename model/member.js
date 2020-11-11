let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MemberSchema = new Schema({
        name: { type: String, required: true },
        role: { type: String, required: true, enum: [ 'Développeur', 'Testeur', 'Product Owner' ] },
        email: { type: String, required: true },
        color: { type: String, required: true, default: '#aaaaaa' },
    }
);

module.exports = mongoose.model('member', MemberSchema);
