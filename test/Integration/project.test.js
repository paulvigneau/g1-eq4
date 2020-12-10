process.env.NODE_ENV = 'test';

const app = require('../../app');
const mongoose = require('mongoose');
const dbConfig = require('../../config/db');
const assert = require('assert');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const projectService = require('../../services/projectService');
const memberService = require('../../services/memberService');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Project integration tests', () => {
    let project;

    before('connect', async () => {
        await dbConfig.connectToDB();

        project = await projectService.addProject({
            name: 'Super Projet',
            description: 'Une description intéressante',
            start: '2070-10-10',
            end: '2070-10-20'
        });
    });

    it('should add a new member in project in database', async () => {
        let resMember = await chai
            .request(app)
            .post('/projects/' + project._id + '/member')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                name: 'Bob',
                role: 'Développeur',
                email: 'bob@mail.com',
            });

        expect(resMember.status).to.equal(200);

        await projectService.getProjectByID(project._id)
            .then((project) => {
                const member = project.members[0];

                assert(member.name === 'Bob'
                    && member.role === 'Développeur'
                    && member.email === 'bob@mail.com'
                );
            });
    });

    it('should delete a member in project in database', async () => {
        await projectService.getProjectByID(project._id)
            .then(async (project) => {
                const member = project.members[0];

                assert(member.name === 'Bob'
                    && member.role === 'Développeur'
                    && member.email === 'bob@mail.com'
                );

                let resMember = await chai
                    .request(app)
                    .delete('/projects/' + project._id + '/members/' + member._id)
                    .set('content-type', 'application/x-www-form-urlencoded');

                expect(resMember.status).to.equal(200);

                await memberService.getMemberById(project._id, member._id)
                    .then((member) => {
                        assert(!member);
                    });
            });
    });
});

after(function (done) {
    mongoose.model('project').deleteMany({}, done);
});