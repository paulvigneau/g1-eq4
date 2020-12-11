process.env.NODE_ENV = 'test';

require('../../app');
const projectService = require('../../services/projectService');
const sprintService = require('../../services/sprintService');
const userStoryService = require('../../services/userStoryService');
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

    after(async function() {
        await driver.quit();
        await mongoose.model('project').deleteMany({});
    });

    describe('Create and new sprint', () => {
        after(async function () {
            const p = await projectService.getProjectByID(project._id);
            p.management.backlog.sprints = [];
            return p.save();
        });

        it('should create a sprint', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

            await driver.findElement(By.css('#new-sprint-button')).click();

            await driver.findElement(By.css('#add-sprint #start')).sendKeys('01-01-2070');
            await driver.findElement(By.css('#add-sprint #end')).sendKeys('02-01-2070');

            await driver.findElement(By.css('#add-sprint button.btn[type=\'submit\']')).click();

            await driver.wait(
                async () => await until.elementIsVisible(await driver.findElement(By.css('.pop-up-wrapper'))),
                10000
            );
        }).timeout(20000);

        it('should display the sprint', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

            await driver.findElement(By.css('.mt-3 .sprint-date')).getText()
                .then((text) => {
                    expect(text).to.be.equal('01 janv. 2070 - 02 janv. 2070');
                });
        }).timeout(20000);
    });

    describe('Delete a sprint containing a user story and put it in a new sprint', () => {
        before(async function () {
            const sprint1 = await sprintService.addSprint(project._id, '2070-01-10', '2070-01-11');
            await userStoryService.addUS(project._id, sprint1._id, 'En tant que..., je souhaite pouvoir..., afin de...', 1);
        });

        after(async function () {
            const p = await projectService.getProjectByID(project._id);
            p.management.backlog.sprints = [];
            p.management.backlog.backlog.USList = [];
            return p.save();
        });

        it('should delete the sprint and transfer all its us in the backlog section', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

            const deleteButton = await driver.findElement(By.css('.delete-sprint-button'));
            await deleteButton.click();

            await driver.wait(until.alertIsPresent());
            await driver.switchTo().alert().accept();
            await driver.wait(until.stalenessOf(deleteButton));

            await driver.findElements(By.css('.us-container.sprint'))
                .then((sprints) => {
                    expect(sprints.length).to.be.equal(0);
                });

            await driver.findElements(By.css('#backlog .user-story'))
                    .then((userStories) => {
                        expect(userStories.length).to.be.equal(1);
                    });

        }).timeout(20000);

        it('should add a label to user story from a deleted sprint', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

            await driver.findElement(By.css('#backlog > div > small')).getText()
                .then((text) => {
                    expect(text).to.be.equal('Sprint supprimé');
                });
        }).timeout(20000);

        it('should remove label of the moved user story', async () => {
            await sprintService.addSprint(project._id, '2070-01-10', '2070-01-11');
            await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

            let userStory = await driver.findElement(By.css('#backlog .user-story'));
            const sprint = await driver.findElement(By.css('.us-container.sprint'));

            await userStory.findElement(By.css('small')).getText()
                .then((text) => {
                    expect(text).to.be.equal('Sprint supprimé');
                });

            await driver.actions().dragAndDrop(userStory, sprint).perform();

            await driver.wait(until.stalenessOf(userStory));

            userStory = await driver.findElement(By.css('.us-container.sprint .user-story'));
            await userStory.findElement(By.css('small')).getText()
                .then((text) => {
                    expect(text).to.be.empty;
                });

        }).timeout(20000);
    });

    describe('Drag & drop user story from sprint to another sprint', () => {
        after(async function () {
            const p = await projectService.getProjectByID(project._id);
            p.management.backlog.sprints = [];
            return p.save();
        });

        before(async function () {
            const sprint1 = await sprintService.addSprint(project._id, '2070-01-10', '2070-01-11');
            await sprintService.addSprint(project._id, '2070-01-12', '2070-01-13');
            await userStoryService.addUS(project._id, sprint1._id, 'En tant que..., je souhaite pouvoir..., afin de...', 1);
        });

        it('should drag the user story from sprint1 and drop it in sprint2', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

            const allSprints = await driver.findElements(By.css('div.us-container.sprint'));
            const sprint1Element = await allSprints[1];
            const sprint2Element = await allSprints[0];

            await checkTransferUs(sprint1Element, sprint2Element);
        }).timeout(20000);

        it('should drag the user story from sprint2 and drop it in backlog', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

            const sprint2Element = await (await driver.findElements(By.css('div.us-container.sprint')))[0];
            const backlogElement = await driver.findElement(By.id('backlog'));

            await checkTransferUs(sprint2Element, backlogElement);
        }).timeout(20000);
    });

    describe('Display sprints on backlog page', () => {
        after(async function () {
            const p = await projectService.getProjectByID(project._id);
            p.management.backlog.sprints = [];
            return p.save();
        });

        before(async function () {
            await sprintService.addSprint(project._id, '2070-01-10', '2070-01-11');
            await sprintService.addSprint(project._id, '2070-01-14', '2070-01-15');
            await sprintService.addSprint(project._id, '2070-01-12', '2070-01-13');
        });

        it('should display sprints in the order of arrival', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

            await driver.findElement(By.xpath('/html/body/div/div/p[1]')).getText()
                .then((text) => {
                    expect(text).to.be.equal('14 janv. 2070 - 15 janv. 2070');
                });
            await driver.findElement(By.xpath('/html/body/div/div/p[2]')).getText()
                .then((text) => {
                    expect(text).to.be.equal('12 janv. 2070 - 13 janv. 2070');
                });
            await driver.findElement(By.xpath('/html/body/div/div/p[3]')).getText()
                .then((text) => {
                    expect(text).to.be.equal('10 janv. 2070 - 11 janv. 2070');
                });
        }).timeout(20000);
    });
});

async function checkTransferUs(from, to){
    await from.findElements(By.css('.user-story'))
        .then(userStories => {
            expect(userStories.length).to.be.equal(1);
        });
    await from.findElement(By.css('.user-story'))
        .then(async (userStory) => {
            await driver.actions().dragAndDrop(userStory, to).perform();
        });
    await from.findElements(By.css('.user-story'))
        .then(userStories => {
            expect(userStories.length).to.be.equal(0);
        });
}
