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

before(function () {
    driver = new Builder()
        .forBrowser('chrome')
        .build();
});

async function saveUserStory(projectId, description, difficulty){
    await driver.get('http://localhost:3000/projects/' + projectId + '/backlog/new-user-story');

    await driver.findElement(By.id('description'))
        .then(async element => {
            await element.sendKeys(description);
        });

    if(difficulty == 1){
        await driver.findElement(By.xpath('.//*[@id="difficulty"]/option[1]')).click();
    }
    if(difficulty == 2){
        await driver.findElement(By.xpath('.//*[@id="difficulty"]/option[2]')).click();
    }
    if(difficulty == 3){
        await driver.findElement(By.xpath('.//*[@id="difficulty"]/option[3]')).click();
    }
    if(difficulty == 5){
        await driver.findElement(By.xpath('.//*[@id="difficulty"]/option[4]')).click();
    }

    await driver.findElement(By.className('btn btn-success'))
        .then(async element => {
            await element.click();
        });
}

describe('New userStory page', () => {
    it('should be redirected to the creation page of user stories', async () => {
        await driver.get('http://localhost:3000');

        await driver.findElements(By.className('btn btn-success'))
            .then(async elements => {
                await elements[0].click();
            });

        await driver.findElement(By.id('description'))
            .then(async (element) => {
                expect(element).to.be.not.undefined;
            });

        await driver.findElement(By.id('difficulty'))
            .then(async (element) => {
                expect(element).to.be.not.undefined;
            });

    }).timeout(10000);
});

describe('addUserStory & displayUS', () => {
    it('this should create an user story and display it in backlog', async () => {
        await testProjects.saveProject('Projet 10', 'Magnifique projet', '22-11-2021', '25-11-2021');
        await projectService.getProjectByName('Projet 10')
            .then(async (project) => {
                await saveUserStory(project._id, 'En tant que..., je souhaite pouvoir..., afin de...', 3);
                await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

                await driver.findElements(By.className('us-container'))
                    .then(async userStories => {
                        expect(userStories.length).to.be.equal(1);
                    });

                const userStoryRows = await driver.findElement(By.className('user-story border row m-0'));
                userStoryRows.findElement(By.id('userStoryId')).getText()
                    .then((text) => {
                        expect(text).to.be.equal('1');
                    });
                userStoryRows.findElement(By.id('userStoryDescription')).getText()
                    .then((text) => {
                        expect(text).to.be.equal('En tant que..., je souhaite pouvoir..., afin de...');
                    });
                userStoryRows.findElement(By.id('userStoryDifficulty')).getText()
                    .then((text) => {
                        expect(text).to.be.equal('3');
                    });
            });
    }).timeout(10000);
});

after(function(done) {
    driver.quit();
    mongoose.model('project').deleteMany({}, done);
});