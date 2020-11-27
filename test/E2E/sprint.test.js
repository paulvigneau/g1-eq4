process.env.NODE_ENV = 'test';

const projectService = require('../../services/project');
const sprintService = require('../../services/sprint');
const userStoryService = require('../../services/user-story');
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

    describe('Create and delete new sprint', () => {
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

        it('should delete a sprint // TODO', async () => {
            // await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');
            //
            // await driver.findElement(By.css('.delete-sprint-button')).click();
            //
            // await driver.findElements(By.id('us-container sprint'))
            //     .then(async (elements) => {
            //         expect(elements.length).to.be.equal(0);
            //     });
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
        });

        it('should drag the user story from sprint2 and drop it in backlog', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

            const sprint2Element = (await driver.findElements(By.className('us-container sprint')))[0];
            const backlogElement = await driver.findElement(By.id('backlog'));

            await checkTransferUs(sprint2Element, backlogElement);
        });
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
        });
    });
});

async function checkTransferUs(from, to){
    await from.findElements(By.className('user-story border row m-0'))
        .then(async userStories => {
            expect(userStories.length).to.be.equal(1);
        });
    await from.findElement(By.className('user-story border row m-0'))
        .then(async (userStory) => {
            await driver.actions().dragAndDrop(userStory, to).perform();
        });
    await from.findElements(By.className('user-story border row m-0'))
        .then(async userStories => {
            expect(userStories.length).to.be.equal(0);
        });
}

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
