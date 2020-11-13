process.env.NODE_ENV = 'test';

const app = require('../../app');
const mongoose = require('mongoose');
const assert = require('assert');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
let projectService = require('../../services/project');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Projects unit tests', () => {

    it('should get all the project stored', async () => {
        const projects = await projectService.getAllProjects();

        mongoose.model('project').find({}).exec((err, expectedProjects) => {
            if (err)
                assert.fail();
            else {
                assert(expectedProjects.length === projects.length);
            }
        });
    });

    it('should get return status 200 when requesting for projects', async () => {
        let res = await chai
            .request(app)
            .get('/')
            .send();

        expect(res.status).to.equal(200);
    });

    it('should add a new project in database', async () => {
        let res = await chai
            .request(app)
            .post('/project')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                name: 'Projet Test',
                description: 'Description de projet de test',
                start: '2020-11-10',
                end: '2020-11-20'
            });

        expect(res.status).to.equal(200);

        const projects = await projectService.getAllProjects();
        assert(projects.find(
            (p) => p.name === 'Projet Test'
                && p.description === 'Description de projet de test'
                && new Date(p.start).valueOf() === new Date('2020-11-10').valueOf()
                && new Date(p.end).valueOf() === new Date('2020-11-20').valueOf()
        ));
    });
});

after(function(done) {
    mongoose.model('project').deleteMany({}, done);
});
