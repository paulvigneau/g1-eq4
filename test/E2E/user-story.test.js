process.env.NODE_ENV = 'test';

require('../../app');
const projectService = require('../../services/projectService');
const sprintService = require('../../services/sprintService');
const chai = require('chai');
const mongoose = require('mongoose');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const { Builder, By, until } = require('selenium-webdriver');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

let driver;
let project;

describe('Add a new User Story, drag it in a sprint and close it', () => {
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

        await sprintService.addSprint(project._id, '2070-01-12', '2070-01-13');
    });

    after(async function() {
        await driver.quit();
        await mongoose.model('project').deleteMany({});
    });

    it('should create a new user story', async () => {
        await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

        await driver.findElement(By.css('#new-us-button')).click();

        let display = await driver.findElement(By.css('.pop-up-wrapper')).getCssValue('display');
        expect(display).to.be.equal('block');

        await driver.findElement(By.css('#edit-description')).sendKeys('Description de l\'us');
        await driver.findElement(By.xpath('//*[@id="edit-difficulty"]/option[1]')).click();

        const addButton = await driver.findElement(By.css('#edit-us-form > button.btn.btn-success'));
        addButton.click();

        await driver.wait(until.stalenessOf(addButton));

        const backlogUS = await driver.findElements(By.xpath('//*[@id="userStoryDescription"]'));

        expect(backlogUS.length).to.be.equal(1);


        // await driver.wait(
        //     async () => await until.elementIsVisible(await driver.findElement(By.css('.pop-up-wrapper'))),
        //     10000
        // );
    }).timeout(10000);

    it('should display the user story in backlog', async () => {
        await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

        await driver.findElements(By.css('#backlog .user-story'))
            .then(async userStories => {
                expect(userStories.length).to.be.equal(1);
            });

        await driver.findElement(By.css('.user-story #userStoryId')).getText()
            .then((text) => {
                expect(text).to.be.equal('#1');
            });
        await driver.findElement(By.css('.user-story #userStoryDescription')).getText()
            .then((text) => {
                expect(text).to.be.equal('Description de l\'us');
            });
        await driver.findElement(By.css('.user-story #userStoryDifficulty')).getText()
            .then((text) => {
                expect(text).to.be.equal('1');
            });
    }).timeout(10000);

    it('should drag and drop the user story in a sprint', async () => {
        const sprint = await (await driver.findElements(By.css('.sprint')))[0];

        await driver.findElements(By.css('#backlog .user-story'))
            .then(async userStories => {
                expect(userStories.length).to.be.equal(1);
            });

        await driver.findElement(By.css('#backlog .user-story'))
            .then(async (userStory) => {
                await driver.actions().dragAndDrop(userStory, sprint).perform();
            });

        await driver.findElements(By.css('#backlog .user-story'))
            .then(async userStories => {
                expect(userStories.length).to.be.equal(0);
            });

        await sprint.findElements(By.css('.user-story'))
            .then(async userStories => {
                expect(userStories.length).to.be.equal(1);
            });
    });

    it('should close the user story', async () => {
        await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

        let sprint = await (await driver.findElements(By.css('.sprint')))[0];
        let userStory = await (await sprint.findElements(By.css('.user-story')))[0];

        await userStory.findElement(By.css('.us-more')).click();
        await userStory.findElement(By.css('.close-us-button')).click();

        await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

        let usClasses = await (await driver.findElements(By.css('.user-story')))[0].getAttribute('class');
        console.log('classes:' + usClasses);
        expect(usClasses).to.contain('unsortable text-muted');
    });
});
