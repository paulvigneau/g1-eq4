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
let memberService = require('../../services/memberService');
let userStoryService = require('../../services/userStoryService');
let sprintService = require('../../services/sprintService');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

function allEqual(array, value){
    return array.every( element => element === value );
}

describe('Tasks integration tests', () => {
    let project;
    let firstTask;
    let firstUserStory;
    let memberFirstTask;

    before('connect', async () => {
        await dbConfig.connectToDB();

        project = await projectService.addProject({
            name: 'Super Projet',
            description: 'Une description intéressante',
            start: '2070-10-10',
            end: '2070-10-20'
        });
    });

    it('should add a task in TODO in project in database', async () => {
        firstUserStory = await userStoryService.addUS(project._id, null, 'En tant que... Je souhaite... Afin de...', 1, 0);

        let resTask = await chai
            .request(app)
            .post('/projects/' + project._id + '/tasks')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                description: 'Magnifique description de task, vraiment',
                type: 'DEV',
                cost: '50',
                member: null,
                USList: firstUserStory._id.toString(),
                dependencies: [],
            });

        expect(resTask.status).to.equal(200);

        await projectService.getProjectByID(project._id)
            .then((project) => {
                firstTask = project.management.tasks[0];

                assert(firstTask.description === 'Magnifique description de task, vraiment'
                    && firstTask.type === 'DEV'
                    && firstTask.cost === 50
                    && firstTask.status === 'TODO'
                    && !firstTask.member
                );

                assert(allEqual(firstTask.checklist, false));

                assert(firstTask.USList.length === 1);
                assert(firstTask.USList[0].equals(firstUserStory._id));

                assert(firstTask.dependencies.length === 0);

            });
    });
        it('should add a task in WIP in project in database', async () => {
            const member = await memberService.addMember(project._id, 'John', 'John@mail.com', 'Testeur');
            const sprint = await sprintService.addSprint(project._id, '2070-10-10', '2070-10-20');
            const userStory = await userStoryService.addUS(project._id, sprint._id, 'En tant que... Je souhaite... Afin de...', 1, 0);

            let resTask = await chai
                .request(app)
                .post('/projects/' + project._id + '/tasks')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    description: 'Magnifique description de task, vraiment',
                    type: 'TEST',
                    cost: '20',
                    member: member._id.toString(),
                    USList: userStory._id.toString(),
                    dependencies: firstTask._id.toString(),
                });

            expect(resTask.status).to.equal(200);

            await projectService.getProjectByID(project._id)
                .then((project) => {
                    const secondTask = project.management.tasks[1];

                    assert(secondTask.description === 'Magnifique description de task, vraiment'
                        && secondTask.type === 'TEST'
                        && secondTask.cost === 20
                        && secondTask.status === 'WIP'
                        && secondTask.member.equals(member._id)
                    );

                    assert(allEqual(secondTask.checklist, false));

                    assert(secondTask.USList.length === 1);
                    assert(secondTask.USList[0].equals(userStory._id));

                    assert(secondTask.dependencies.length === 1);
                    assert(secondTask.dependencies[0].equals(firstTask._id));

                });
        });

    it('should update the task in TODO by assigning a member in project in database', async () => {
        memberFirstTask = await memberService.addMember(project._id, 'Bob', 'Bobby@mail.com', 'Développeur');

        let resTask = await chai
            .request(app)
            .put('/projects/' + project._id + '/tasks')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                taskId: firstTask._id.toString(),
                description: 'Magnifique description de task, vraiment',
                type: 'DEV',
                cost: '50',
                member: memberFirstTask._id.toString(),
                USList: firstUserStory._id.toString(),
                dependencies: [],
            });

        expect(resTask.status).to.equal(200);

        await projectService.getProjectByID(project._id)
            .then((project) => {
                const taskModified = project.management.tasks[0];

                assert(taskModified.description === 'Magnifique description de task, vraiment'
                    && taskModified.type === 'DEV'
                    && taskModified.cost === 50
                    && taskModified.status === 'WIP'
                    && taskModified.member.equals(memberFirstTask._id)
                );

                assert(allEqual(firstTask.checklist, false));

                assert(firstTask.USList.length === 1);
                assert(firstTask.USList[0].equals(firstUserStory._id));

                assert(firstTask.dependencies.length === 0);

            });
    });

    it('should update the task in DONE by changing the whole dod in project in database', async () => {
        let resTask = await chai
            .request(app)
            .put('/projects/' + project._id + '/tasks')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                taskId: firstTask._id.toString(),
                description: 'Magnifique description de task, vraiment',
                type: 'DEV',
                cost: '50',
                dodValues: 'true,true,true,true',
                member: memberFirstTask._id.toString(),
                USList: firstUserStory._id.toString(),
                dependencies: [],
            });

        expect(resTask.status).to.equal(200);

        await projectService.getProjectByID(project._id)
            .then((project) => {
                const taskPassedToDone = project.management.tasks[0];

                assert(taskPassedToDone.description === 'Magnifique description de task, vraiment'
                    && taskPassedToDone.type === 'DEV'
                    && taskPassedToDone.cost === 50
                    && taskPassedToDone.status === 'DONE'
                    && taskPassedToDone.member.equals(memberFirstTask._id)
                );


                assert(allEqual(taskPassedToDone.checklist, true));

                assert(firstTask.USList.length === 1);
                assert(firstTask.USList[0].equals(firstUserStory._id));

                assert(firstTask.dependencies.length === 0);

            });
    });
});

after(function (done) {
    mongoose.model('project').deleteMany({}, done);
});
