process.env.NODE_ENV = 'test';

const testProjects = require('./projects.test');
const projectService = require('../../services/project');
const chai = require('chai');
const mongoose = require('mongoose');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const { Builder, By } = require('selenium-webdriver');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);
let driver;

let project;

before(function () {
    driver = new Builder()
        .forBrowser('chrome')
        .build();
});

async function saveSprint(projectId, start, end){
    await driver.get('http://localhost:3000/projects/' + projectId + '/backlog/new-sprint');

    await driver.findElement(By.id('start'))
        .then(async element => {
            await element.sendKeys(start);
        });

    await driver.findElement(By.id('end'))
        .then(async element => {
            await element.sendKeys(end);
        });

    await driver.findElement(By.className('btn btn-success'))
        .then(async element => {
            await element.click();
        });
}

describe('createSprint', () => {
    it('this should create a sprint and display it in backlog', async () => {
        await testProjects.saveProject('Projet 8', 'Magnifique projet', '22-11-2021', '25-11-2021');
        await projectService.getProjectByName('Projet 8')
            .then(async (project) => {
                await saveSprint(project._id, '23-11-2021', '25-11-2021');
                await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');
                const divClass = await driver.findElement(By.className('mt-3'));
                divClass.findElement(By.id('date')).getText()
                    .then((text) => {
                        expect(text).to.be.equal('23 nov. 2021 - 25 nov. 2021');
                    });
            });
    }).timeout(20000);
});

describe('deleteSprint success', () => {
    it('this should delete a sprint', async () => {
        await testProjects.saveProject('Projet 9', 'Magnifique projet', '22-11-2021', '25-11-2021');
        await projectService.getProjectByName('Projet 9')
            .then(async project => {
                await saveSprint(project._id, '23-11-2021', '25-11-2021');
                await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');
                const divClass = await driver.findElement(By.className('mt-3'));

                await divClass.findElement(By.className('btn btn-danger float-right'))
                    .then(async element => {
                        await element.click();
                    });

                await divClass.findElements(By.id('us-container sprint'))
                    .then(async (elements) => {
                        expect(elements.length).to.be.equal(0);
                    });

            });
    }).timeout(20000);
});

// describe('labelAfterSprintDeletion', () => {
//     it('this should delete a sprint and display its user stories in backlog', async () => {
//         await projectService.getProjectByName('Projet 9')
//             .then(async project => {
//                 await saveSprint(project._id, '23-11-2020', '25-11-2020');
//
//                 await driver.get('http://localhost:3000/projects/' + project._id);
//
//                 await driver.findElement(By.className('btn btn-danger float-right'))
//                     .then(async element => {
//                         await element.click();
//
//                         const divClass = await driver.findElement(By.className('mt-3'));
//                         divClass.findElement(By.id('date'))
//                             .then((elements) => {
//                                 expect(elements.length).to.be.equal(0);
//                             });
//                     });
//             });
//     }).timeout(10000);
// });

after(function(done) {
    driver.quit();
    mongoose.model('project').deleteMany({}, done);
});