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
    describe('Get all projects', () => {
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

        it('should get code 200 when requesting for projects', async () => {
            let res = await chai
                .request(app)
                .get('/')
                .send();

            expect(res.status).to.equal(200);
        });
    });

    describe('Add new project', () => {
        it('should add a new project in database', async () => {
            const project = await projectService.addProject({
                name: 'Super Projet',
                description: 'Une description intéressante',
                start: '2070-10-10',
                end: '2070-10-20'
            });

            const projects = await projectService.getAllProjects();
            assert(projects.find(
                (p) => p.name === project.name
                    && p.description === project.description
                    && new Date(p.start).valueOf() === new Date(project.start).valueOf()
                    && new Date(p.end).valueOf() === new Date(project.end).valueOf()
            ));
        });

        it('should return code 200 when adding project', async () => {
            let res = await chai
                .request(app)
                .post('/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    name: 'Projet Test',
                    description: 'Description de projet de test',
                    start: '2070-11-10',
                    end: '2070-11-20'
                });

            expect(res.status).to.equal(200);
        });

        it('should return code 400 when adding project with bad values', async () => {
            let res = await chai
                .request(app)
                .post('/project')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    name: 'Projet Test',
                    description: 'Description de projet de test',
                    start: '2000-11-10',
                    end: '2070-11-20'
                });

            expect(res.status).to.equal(400);
        });
    });
});

after(function(done) {
    mongoose.model('project').deleteMany({}, done);
});
