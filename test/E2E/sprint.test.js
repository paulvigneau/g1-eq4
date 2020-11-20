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
                await saveSprint(project._id, '22-11-2020', '25-11-2020');
                await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');
                await driver.findElement(By.id('date')).getText()
                    .then(async text => {
                        expect(text).to.be.equal('22 nov. 2020 - 25 nov. 2020');
                    });
            });

    }).timeout(10000);
});

after(function(done) {
    driver.quit();
    mongoose.model('project').deleteMany({}, done);
});