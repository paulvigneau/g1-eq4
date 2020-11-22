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
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email.text);
}, 'Le champ email n\'est pas conforme.');

module.exports = mongoose.model('member', MemberSchema);
