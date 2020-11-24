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
let sprintService = require('../../services/sprint');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Backlog unit tests', () => {
    describe('Add User Story', function () {
        let project;

        before(async function() {
            project = await projectService.addProject({
                name: 'Super Projet',
                description: 'Une description intéressante',
                start: '2070-10-10',
                end: '2070-10-20'
            });
        });

        after(function(done) {
            mongoose.model('project').deleteMany({}, done);
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

    describe('Update User Story position', function () {
        let project;
        let sprint;
        let userStory;

        before(async function() {
            project = await projectService.addProject({
                name: 'Super Projet',
                description: 'Une description intéressante',
                start: '2070-10-10',
                end: '2070-10-20'
            });

            sprint = await sprintService.addSprint(
                project._id,
                '2070-10-11',
                '2070-10-12'
            );
        });

        beforeEach(async function () {
            userStory = await userStoryService.addUS(
                project._id,
                null,
                'Super User Story',
                1
            );
        });

        after(function(done) {
            mongoose.model('project').deleteMany({}, done);
        });

        it('should update the position of a sprint in database', async () => {
            let newUS = await userStoryService.transferUS(
                project._id,
                null,
                sprint._id,
                userStory._id,
                0
            );
            let receivedUS = await userStoryService.getUSById(project._id, sprint._id, newUS._id);

            assert(newUS.toString() === receivedUS.toString());
        });

        it('should return code 200', async () => {
            let res = await chai
                .request(app)
                .put('/projects/' + project._id + '/backlog/user-story')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    from: null,
                    to: sprint._id.toString(),
                    usId: userStory._id.toString(),
                    index: 0
                });

            expect(res.status).to.equal(200);
        });

        it('should return code 400', async () => {
            let res = await chai
                .request(app)
                .put('/projects/' + project._id + '/backlog/user-story')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    from: sprint._id.toString(),
                    to: sprint._id.toString(),
                    usId: userStory._id.toString(),
                    index: 0
                });

            expect(res.status).to.equal(400);
        });

        it('should delete user story', async () => {
            await userStoryService.deleteUS(project._id, null, userStory._id);
            const receivedUS = await userStoryService.getUSById(project._id, null, userStory._id);

            assert(!receivedUS);
        });
    });

    describe('Add sprint', function () {
        let project;

        before(async function() {
            project = await projectService.addProject({
                name: 'Super Projet',
                description: 'Une description intéressante',
                start: '2070-10-10',
                end: '2070-10-20'
            });
        });

        after(function(done) {
            mongoose.model('project').deleteMany({}, done);
        });

        it('should add a new sprint in database', async () => {
            let newSprint = await sprintService.addSprint(project._id, '2070-10-11', '2070-10-12');
            let receivedSprint = await sprintService.getSprintByID(project._id, newSprint._id);

            assert(newSprint.toString() === receivedSprint.toString());
        });

        it('should return code 200', async () => {
            let res = await chai
                .request(app)
                .post('/projects/' + project._id + '/backlog/sprint')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    start: '2070-10-13',
                    end: '2070-10-14'
                });

            expect(res.status).to.equal(200);
        });

        it('should return code 400', async () => {
            let res = await chai
                .request(app)
                .post('/projects/' + project._id + '/backlog/sprint')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    start: '2070-10-19',
                    end: '2070-10-21'
                });

            expect(res.status).to.equal(400);
        });
    });
});

after(function(done) {
    mongoose.model('project').deleteMany({}, done);
});
