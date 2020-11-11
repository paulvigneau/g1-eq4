const app = require('../../../app');
const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
let Project = require('../../../models/project');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Projects tests', () => {

    it('should add a new project in database', async () => {
        let res = await chai
            .request(app)
            .post('/project')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                name: 'Projet Test',
                description: 'Description de projet de test',
                startDate: '2020-11-10',
                endDate: '2020-11-20'
            });

        expect(res.status).to
            .equal(200);

        await Project.getAllProjects().then(
            (projects) => {
                assert(projects.find(
                    (p) => p.name === 'Projet Test'
                        && p.description === 'Description de projet de test'
                        && p.start === '2020-11-10'
                        && p.end === '2020-11-20'
                ));
            });
    });
});
