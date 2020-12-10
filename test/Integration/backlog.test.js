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
let sprintService = require('../../services/sprintService');
const { BadRequestError, NotFoundError } = require('../../errors/Error');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Backlog integration tests', () => {
    let project;
    let userStory;
    let lastSprint;

    before('connect', async () => {
        await dbConfig.connectToDB();

        project = await projectService.addProject({
            name: 'Super Projet',
            description: 'Une description intéressante',
            start: '2070-10-10',
            end: '2070-10-20'
        });
    });

    it('should add a new user story in project in database', async () => {
        let resUserStory = await chai
            .request(app)
            .post('/projects/' + project._id + '/backlog/user-story')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                description: 'En tant que... Je souhaite... Afin de...',
                difficulty: 3
            });

        expect(resUserStory.status).to.equal(200);

        await projectService.getProjectByID(project._id)
            .then((project) => {
                userStory = project.management.backlog.backlog.USList[0];

                assert(userStory.description === 'En tant que... Je souhaite... Afin de...'
                    && userStory.difficulty === 3
                    && userStory.priority === 0
                );
            });
    });

    it('should add a new sprint in project in database', async () => {
        let resSprint = await chai
            .request(app)
            .post('/projects/' + project._id + '/backlog/sprint')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                start: '2070-10-10',
                end: '2070-10-20'
            });

        expect(resSprint.status).to.equal(200);

        await projectService.getProjectByID(project._id)
            .then((project) => {
                const sprint = project.management.backlog.sprints[0];

                assert(new Date(sprint.start).valueOf() === new Date('2070-10-10').valueOf()
                    && new Date(sprint.end).valueOf() === new Date('2070-10-20').valueOf()
                );
            });
    });

    it('should delete a sprint in project in database', async () => {
        await projectService.getProjectByID(project._id)
            .then(async (project) => {
                const sprint = project.management.backlog.sprints[0];

                assert(new Date(sprint.start).valueOf() === new Date('2070-10-10').valueOf()
                    && new Date(sprint.end).valueOf() === new Date('2070-10-20').valueOf()
                );

                let resSprint = await chai
                    .request(app)
                    .delete('/projects/' + project._id + '/backlog/sprints/' + sprint._id)
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .query({ force: 'true' });

                expect(resSprint.status).to.equal(200);

                await sprintService.deleteSprint(project._id, sprint._id)
                    .then((sprint) => {
                        assert.fail('sprint was found');
                    })
                    .catch((err) => {
                        assert.deepStrictEqual(err, new NotFoundError(`No sprint ${sprint._id} found.`));
                    });
            });
    });

    it('should modify an user story in project in database', async () => {
        let resUserStoryModified = await chai
            .request(app)
            .put('/projects/' + project._id + '/backlog/user-story')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                sprintId: null,
                usId: userStory._id.toString(),
                description: 'blablabla',
                difficulty: 1
            });

        expect(resUserStoryModified.status).to.equal(200);

        await projectService.getProjectByID(project._id)
            .then((project) => {
                const userStoryModified = project.management.backlog.backlog.USList[0];

                assert(userStoryModified.description === 'blablabla'
                    && userStoryModified.difficulty === 1
                    && userStoryModified.priority === 0
                    && userStoryModified.status === 'Normal'
                );
            });
    });

    it('should transfer an user story to another sprint from backlog in project in database', async () => {
        lastSprint = await sprintService.addSprint(project._id, '2070-10-10', '2070-10-20');

        let res = await chai
            .request(app)
            .put('/projects/' + project._id + '/backlog/user-story/move')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                from: null,
                to: lastSprint._id.toString(),
                usId: userStory._id.toString(),
                index: 0
            });

        expect(res.status).to.equal(200);

        await projectService.getProjectByID(project._id)
            .then((project) => {
                const sprint = project.management.backlog.sprints[0];

                assert(sprint.USList[0].description === 'blablabla'
                    && sprint.USList[0].difficulty === 1
                    && sprint.USList[0].priority === 0
                    && sprint.USList[0].status === 'Normal'
                );
            });
    });

    it('should close an user story in a sprint in project in database', async () => {

        let res = await chai
            .request(app)
            .put('/projects/' + project._id + '/backlog/' + lastSprint._id + '/' + userStory._id + '/close')
            .set('content-type', 'application/x-www-form-urlencoded');

        expect(res.status).to.equal(200);

        await projectService.getProjectByID(project._id)
            .then((project) => {
                const sprint = project.management.backlog.sprints[0];

                assert(sprint.USList[0].description === 'blablabla'
                    && sprint.USList[0].difficulty === 1
                    && sprint.USList[0].priority === 0
                    && sprint.USList[0].status === 'Closed'
                );
            });
    });

});

after(function (done) {
    mongoose.model('project').deleteMany({}, done);
});