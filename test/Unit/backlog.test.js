process.env.NODE_ENV = 'test';

const app = require('../../app');
const mongoose = require('mongoose');
const assert = require('assert');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
let projectService = require('../../services/project');
let userStoryService = require('../../services/user-story');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Backlog unit tests', () => {
    let project;

    before(async function() {
        project = await projectService.addProject({
            name: 'Super Projet',
            description: 'Une description intéressante',
            start: '2070-10-10',
            end: '2070-10-20'
        });
    });

    it('should add a new user story in database', async () => {
        let newUS = await userStoryService.addUS(project._id, null, 'Super User Story', 1);
        let receivedUS = await userStoryService.getUSById(project._id, null, newUS._id);

        assert(newUS.toString() === receivedUS.toString());
    });

    it('should return code 200', async () => {
        let res = await chai
            .request(app)
            .post('/projects/' + project._id + '/backlog/new-user-story')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                description: 'Bob',
                difficulty: '1'
            });

        expect(res.status).to.equal(200);
    });

    it('should return code 400', async () => {
        let res = await chai
            .request(app)
            .post('/projects/' + project._id + '/backlog/new-user-story')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                description: 'Bob',
                difficulty: '4'
            });

        expect(res.status).to.equal(400);
    });
});

after(function(done) {
    mongoose.model('project').deleteMany({}, done);
});
