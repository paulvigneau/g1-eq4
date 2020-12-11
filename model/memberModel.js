let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MemberSchema = new Schema({
        name: { type: String, required: true },
        role: { type: String, required: true, enum: [ 'Développeur', 'Testeur', 'Product Owner', 'Scrum Master' ] },
        email: { type: String, required: true },
        color: { type: String, required: true, default: 'aaaaaa' },
    }
);

MemberSchema.path('email').validate((email) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
}, 'Le champ email n\'est pas conforme.');

module.exports = mongoose.model('member', MemberSchema);
