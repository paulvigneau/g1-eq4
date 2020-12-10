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

describe('Projects integration tests', () => {
    before('connect', async () => {
        await dbConfig.connectToDB();
    });

    describe('Integration test', () => {
        it('should add a new project in database', async () => {
            let resProject = await chai
                .request(app)
                .post('/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    name: 'Projet Test',
                    description: 'Description de projet de test',
                    start: '2070-11-10',
                    end: '2070-11-20'
                });

            expect(resProject.status).to.equal(200);

            const project = await projectService.getProjectByName('Projet Test');

            assert(project.name === 'Projet Test'
                    && project.description === 'Description de projet de test'
                    && new Date(project.start).valueOf() === new Date('2070-11-10').valueOf()
                    && new Date(project.end).valueOf() === new Date('2070-11-20').valueOf()
            );
        });
    });
});

after(function (done) {
    mongoose.model('project').deleteMany({}, done);
});
