// process.env.NODE_ENV = 'test';

require('../../app');
const projectService = require('../../services/projectService');
const userStoryService = require('../../services/userStoryService');
const memberService = require('../../services/memberService');
const chai = require('chai');
const mongoose = require('mongoose');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const { Builder, By, until } = require('selenium-webdriver');

// const expect = chai.expect;
// chai.use(chaiHttp);
// chai.use(dirtyChai);

// let driver;
// let project;

// describe('Task End to End', () => {
//     before(async function () {
//         driver = await new Builder()
//             .forBrowser('chrome')
//             .build();

//         project = await projectService.addProject({
//             name: 'Projet 777',
//             description: 'Un magnifique project',
//             start: '01-01-2070',
//             end: '01-02-2070',
//         });
//     });

//     after(async function () {
//         await driver.quit();
//         await mongoose.model('project').deleteMany({});
//     });

    describe('Add task to project, display his information', () => {
        it('should add a task', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/tasks');

            await userStoryService.addUS(project._id, null, 'En tant que... Je souhaite... Afin de...', 1, 1);
            await memberService.addMember(project._id, 'Billy', 'Billy@bestdev.com', "Développeur");

            await driver.findElement(By.css('.btn.btn-primary.btn-block.mb-3')).click();

//             let display = await driver.findElement(By.css('.pop-up-wrapper')).getCssValue('display');
//             expect(display).to.be.equal('block');

            await driver.findElement(By.css('.pop-up-wrapper #edit-description')).sendKeys('La beauté incarnée en terme de tâche...');
            await driver.findElement(By.css('.pop-up-wrapper #edit-cost')).sendKeys(50);
            await driver.findElement(By.css('.//*[@id="edit-type"]/option[1]')).click();
            await driver.findElement(By.css('.//*[@id="edit-members"]/option[1]')).click();

//             const dependencies = await driver.findElements(By.css('.pop-up-wrapper fas.fa-pencil-alt.text-primary'));
//             await dependencies[1].click();

//             const userStories = await driver.findElements(By.css('.pop-up-wrapper2 border.mb-2.p-2.user-story-linked'));
//             userStories[0].click();

//             const userStoriesSelected = await driver.findElements(By.css('.pop-up-wrapper2 border.mb-2.p-2.user-story-linked.selected'));
//             expect(userStoriesSelected.length).to.be.equal(1);

//             await driver.findElement(By.css('.pop-up-wrapper2 btn.btn-success.float-right')).click();

//             await driver.findElement(By.css('.pop-up-wrapper button.btn[type=\'submit\']')).click();

//             await driver.wait(
//                 async () => await until.elementIsVisible(await driver.findElement(By.css('.pop-up-wrapper'))),
//                 10000
//             );
//         }).timeout(20000);

//     });

// });
