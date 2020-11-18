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

let project;

// describe('Backlog unit tests', () => {
//
//     before(async function() {
//         project = await projectService.addProject({
//             name: 'Super Projet',
//             description: 'Une description intéressante',
//             start: '2020-10-10',
//             end: '2020-10-20'
//         });
//     });
//
//     it('should add a new user story in database', async () => {
//         let res = await chai
//             .request(app)
//             .post('/projects/' + project._id + '/new-user-story' )
//             .set('content-type', 'application/x-www-form-urlencoded')
//             .send({
//                 description: 'Une description d\'user story intéressante',
//                 difficulty: '5'
//             });
//
//         expect(res.status).to.equal(200);
//
//         let p = await projectService.getProjectByID(project._id);
//         assert(p.management.backlog.backlog.USList.find(
//             (US) => US.description === 'Une description d\'user story intéressante'
//                 && US.difficulty === '5'
//         ));
//     });
// });
//
// after(function(done) {
//     mongoose.model('project').deleteMany({}, done);
// });