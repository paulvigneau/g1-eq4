process.env.NODE_ENV = 'test';

const app = require('../../app');
const Project = require('../../model/projectModel');
const Task = require('../../model/taskModel');
const dbConfig = require('../../config/db');
const projectService = require('../../services/projectService');
const memberService = require('../../services/memberService');
const taskService = require('../../services/taskService');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Tasks unit tests', () => {
    let project;
    let member;

    before('connect', async () => {
        await dbConfig.connectToDB();

        project = await projectService.addProject({
            name: 'Super Projet',
            description: 'Une description intéressante',
            start: '2070-10-10',
            end: '2070-10-20'
        });

        member = await memberService.addMember(
            project._id,
            'Bob',
            'bob@mail.com',
            'Développeur'
        );
    });

    after(function(done) {
        Project.deleteMany({}, done);
    });

    describe('Get tasks', () => {
        let task;

        before(async function() {
            task = new Task({
                description: 'Description de la tâche',
                type: 'GEN',
                cost: 30,
                status: 'WIP',
                checklist: [],
                member: null,
                USList: [],
                dependencies: []
            });
            project.management.tasks.push(task);

            await project.save();
        });

        after(function(done) {
            Task.deleteMany({}, done);
        });

        it('should return code 200', async () => {
            let res = await chai
                .request(app)
                .get('/projects/' + project._id + '/tasks');

            expect(res.status).to.equal(200);
        });

        it('should return code 200 and retrieve all the tasks', async () => {
            let res = await chai
                .request(app)
                .get('/projects/' + project._id + '/tasks/json');

            expect(res.status).to.equal(200);
            expect(res.body.tasks).to.length(1);
            expect(res.body.tasks[0]._id.toString()).to.equal(task._id.toString());
        });

        it('should get all the tasks', async () => {
            const tasks = await taskService.getAllTasks(project._id);
            expect(tasks).to.length(1);
            expect(tasks[0]._id.toString()).to.equal(task._id.toString());
        });

        it('should get task by id', async () => {
            const t = await taskService.getTaskById(project._id, task._id);
            expect(t.toString()).to.equal(task.toString());
        });
    });

    describe('Add task', () => {
        after(function (done) {
            Task.deleteMany({}, done);
        });

        it('should return code 200', async () => {
            let res = await chai
                .request(app)
                .post('/projects/' + project._id + '/tasks')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    description: 'Description de la tâche',
                    type: 'GEN',
                    cost: '30'
                });

            expect(res.status).to.equal(200);
        });

        it('should return code 400 because some params are missing', async () => {
            let res = await chai
                .request(app)
                .post('/projects/' + project._id + '/tasks')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    description: 'Description de la tâche',
                    type: 'GEN'
                });

            expect(res.status).to.equal(400);
        });

        it('should return code 404 because project does not exist', async () => {
            let res = await chai
                .request(app)
                .post('/projects/nonExistantId/tasks')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    description: 'Description de la tâche',
                    type: 'GEN',
                    cost: '30'
                });

            expect(res.status).to.equal(404);
        });

        it('should return code 404 because US sent does not exist', async () => {
            let res = await chai
                .request(app)
                .post('/projects/' + project._id + '/tasks')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    description: 'Description de la tâche',
                    type: 'GEN',
                    cost: '30',
                    USList: 'wrongId, wrongId'
                });

            expect(res.status).to.equal(404);
        });

        it('should return code 404 because tasks sent does not exist', async () => {
            let res = await chai
                .request(app)
                .post('/projects/' + project._id + '/tasks')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    description: 'Description de la tâche',
                    type: 'GEN',
                    cost: '30',
                    dependencies: 'wrongId, wrongId'
                });

            expect(res.status).to.equal(404);
        });

        it('should return code 404 because member assigned does not exist', async () => {
            let res = await chai
                .request(app)
                .post('/projects/' + project._id + '/tasks')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    description: 'Description de la tâche',
                    type: 'GEN',
                    cost: '30',
                    member: 'wrongId'
                });

            expect(res.status).to.equal(404);
        });

        it('should add a task', async () => {
            const task = await taskService.addTask(
                project._id,
                'Description de la tâche',
                'GEN',
                '30',
                '',
                [],
                []
            );

            const t = await taskService.getTaskById(project._id, task._id);
            expect(t.toString()).to.equal(task.toString());
        });

        it('should add a task with member and should move to WIP status', async () => {
            const task = await taskService.addTask(
                project._id,
                'Description de la tâche',
                'GEN',
                '30',
                member._id.toString(),
                [],
                []
            );

            const t = await taskService.getTaskById(project._id, task._id);
            expect(t.status).to.equal('WIP');
        });
    });

    describe('Update task', () => {
        it('should return code 200');
        it('should return code 400 because some params are missing');
        it('should return code 400 when trying to edit task because task has WIP status');
        it('should return code 404 because project does not exist');
        it('should return code 404 because US sent does not exist');
        it('should return code 404 because tasks sent does not exist');
        it('should return code 404 because member assigned does not exist');
        it('should add a member to a task');
        it('should remove the member of a task');
        it('should validate the DOD of a task and should move to DONE');
        it('should validate the DOD of a task and do not move because dependencies are not DONE');
    });
});
