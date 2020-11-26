process.env.NODE_ENV = 'test';

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

describe('Sprint End to End', () => {
    before(async function () {
        driver = await new Builder()
            .forBrowser('chrome')
            .build();

        project = await projectService.addProject({
            name: 'Projet',
            description: 'Un magnifique project',
            start: '2070-01-01',
            end: '2070-02-01',
        });
    });

    after(function (done) {
        driver.quit();
        mongoose.model('project').deleteMany({}, done);
    });

    it('should create a sprint', async () => {
        await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

        await driver.findElement(By.css('#new-sprint-button')).click();

        await driver.findElement(By.css('#add-sprint #start')).sendKeys('01-01-2070');
        await driver.findElement(By.css('#add-sprint #end')).sendKeys('02-01-2070');

        await driver.findElement(By.css('#add-sprint button.btn[type=\'submit\']')).click();

        await driver.wait(
            async () => await driver.findElement(By.css('.pop-up-wrapper')),
            10000
        );
    }).timeout(20000);

    it('should display the sprint', async () => {
        await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

        await driver.findElement(By.css('.mt-3 .sprint-date')).getText()
            .then((text) => {
                expect(text).to.be.equal('01 janv. 2070 - 02 janv. 2070');
            });
    });

    it('should delete a sprint', async () => {
        await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

        await driver.findElement(By.css('.delete-sprint-button')).click();

        await driver.findElements(By.id('us-container sprint'))
            .then(async (elements) => {
                expect(elements.length).to.be.equal(0);
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
