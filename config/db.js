const mongoose = require('mongoose');
const config = require('config');

async function connectToDB() {
    const url = config.DBUrl + '://' +
        (process.env.DATABASE_URL || `localhost:${config.DBPort}`) +
        '/' + config.DBHost;

    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('MongoDB database connection established successfully');
    });
}

module.exports = { connectToDB };
