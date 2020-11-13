process.env.NODE_ENV = 'test';

const app = require('../../app');
const mongoose = require('mongoose');
const assert = require('assert');
const projectService = require('../../services/project');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const Project = require('../../model/project');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

let project;

describe('Project unit tests', () => {

    before(async function() {
        project = await projectService.addProject({
            name: 'Super Projet',
            description: 'Une description intéressante',
            start: '2020-10-10',
            end: '2020-10-20'
        });
    });

    it('should get return status 404 and redirect to /404', async () => {
        let res = await chai
            .request(app)
            .get('/projects/notExistingId')
            .send();

        expect(res).to.have.status(404);
        expect(res.redirects[0]).contain('/404');

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

    it('should get an existing project from its Id', async () => {
        
        const newProject = new Project({
            name: 'Test Project',
            description: 'Un simple projet de test',
            start: '2017-11-10',
            end: '2018-11-20'
        });

        newProject.save(err => {
            if(err)
                throw err;
        });

        projectService.addProject({
            name: 'Test Project',
            description: 'Un simple projet de test',
            start: '2017-11-10',
            end: '2018-11-20'
        });

        assert(newProject);

        let res = await chai
            .request(app)
            .get('/projects/' + newProject._id)
            .send(); 
            
        expect(res).to.have.status(200);
            
        const p = await projectService.getProjectByID(newProject._id);
        assert(p.name === 'Test Project'
            && p.description === 'Un simple projet de test'
            && new Date(p.start).valueOf() === new Date('2017-11-10').valueOf()
            && new Date(p.end).valueOf() === new Date('2018-11-20').valueOf()
        );

    });

});

after(function(done) {
    mongoose.model('project').deleteMany({}, done);
});
