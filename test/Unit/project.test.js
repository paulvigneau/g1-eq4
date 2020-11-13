process.env.NODE_ENV = 'test';

const app = require('../../app');
const mongoose = require('mongoose');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Project unit tests', () => {

    it('should get return status 404 and redirect to /404', async () => {
        let res = await chai
            .request(app)
            .get('/projects/notExistingId')
            .send();

        expect(res).to.have.status(404);
        expect(res.redirects[0]).contain('/404');

    });
});

after(function(done) {
    mongoose.model('project').deleteMany({}, () => {
        mongoose.connection.close(done);
    });
});
