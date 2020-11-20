process.env.NODE_ENV = 'test';

const app = require('../../app');
const mongoose = require('mongoose');
const assert = require('assert');
const projectService = require('../../services/project');
const memberService = require('../../services/member');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Project unit tests', () => {
    let project;

    describe('Project informations', () => {
        before(async function() {
            project = await projectService.addProject({
                name: 'Super Projet',
                description: 'Une description intéressante',
                start: '2021-10-10',
                end: '2021-10-20'
            });
        });

        after(function(done) {
            mongoose.model('project').deleteMany({}, done);
        });

        it('should get return status 404 and redirect to /404', async () => {
            let res = await chai
                .request(app)
                .get('/projects/notExistingId')
                .send();

            expect(res).to.have.status(404);
            expect(res.redirects[0]).contain('/404');

        });

        it('should get an existing project from its Id', async () => {
            let res = await chai
                .request(app)
                .get('/projects/' + project._id)
                .send();

            expect(res).to.have.status(200);

            const p = await projectService.getProjectByID(project._id);
            assert(p.name === 'Super Projet'
                && p.description === 'Une description intéressante'
                && new Date(p.start).valueOf() === new Date('2021-10-10').valueOf()
                && new Date(p.end).valueOf() === new Date('2021-10-20').valueOf()
            );

        });
    });

    describe('New member', () => {
        let project;

        before(async function() {
            project = await projectService.addProject({
                name: 'Super Projet',
                description: 'Une description intéressante',
                start: '2021-10-10',
                end: '2021-10-20'
            });
        });

        after(function(done) {
            mongoose.model('project').deleteMany({}, done);
        });

        it('should add a member to a project', async () => {
            let res = await chai
                .request(app)
                .post('/projects/' + project._id + '/member')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    name: 'Bob',
                    role: 'Développeur',
                    email: 'bob@mail.com',
                });


        expect(res.status).to.equal(200);

            let p = await projectService.getProjectByID(project._id);
            assert(p.members.find(
                (m) => m.name === 'Bob'
                    && m.role === 'Développeur'
                    && m.email === 'bob@mail.com'
            ));
        });

        it('should send an email', () => {
            return memberService.sendEmailToMember(
                project._id,
                'Bob',
                'bob@mail.com',
                'Développeur');
        }).timeout(10000);
    });

    describe('Delete member', () => {
        let project;
        let member;

        before(async function() {
            project = await projectService.addProject({
                name: 'Super Projet',
                description: 'Une description intéressante',
                start: '2021-10-10',
                end: '2021-10-20'
            });
        });

        after(function(done) {
            mongoose.model('project').deleteMany({}, done);
        });

        beforeEach(async function() {
             member = await memberService.addMember(
                project._id,
                'bob',
                'bob@mail.com',
                'Développeur'
            );
        });

        it('should remove a member', async () => {
            await memberService.deleteMember(project._id, member._id);

            await memberService.getMemberById(project._id, member._id)
                .then((member) => assert(!member))
                .catch(() => assert.fail());
        });

        it('should return code 200', async () => {
            let res = await chai
                .request(app)
                .delete('/projects/' + project._id + '/members/' + member._id);

            expect(res.status).to.equal(200);
        });

        it('should remove code 404', async () => {
            let res = await chai
                .request(app)
                .delete('/projects/' + project._id + '/members/nonExistingMemberId');

            expect(res.status).to.equal(404);
        });
    });


});
