process.env.NODE_ENV = 'test';

const app = require('../../app');
const mongoose = require('mongoose');
const dbConfig = require('../../config/db');
const assert = require('assert');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
let projectService = require('../../services/projectService');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Tasks integration tests', () => {
    before('connect', async () => {
        await dbConfig.connectToDB();
    });


});

after(function (done) {
    mongoose.model('project').deleteMany({}, done);
});
