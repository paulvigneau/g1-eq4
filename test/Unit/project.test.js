process.env.NODE_ENV = 'test';

const app = require('../../app');
const assert = require('assert');
const mongoose = require('mongoose');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const Project = require('../../model/project');
let projectService = require('../../services/project');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Project unit tests', () => {

    it('should get return status 404 and redirect to /404', async () => {
        let res = await chai
            .request(app)
            .get('/projects/notExistingId')
            .send();

        expect(res).to.have.status(404);
        expect(res.redirects[0]).contain('/404');

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
