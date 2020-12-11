process.env.NODE_ENV = 'test';

require('../../app');
const projectService = require('../../services/projectService');
const memberService = require('../../services/memberService');
const userStoryService = require('../../services/userStoryService');
const taskService = require('../../services/taskService');
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

describe('Tasks End to End', () => {
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

    it('should create and dislay a new task on TODO section', async () => {
        await driver.get('http://localhost:3000/projects/' + project._id + '/tasks');

        await driver.findElement(By.css('#new-task-button')).click();
        await driver.findElement(By.css('#edit-description')).sendKeys('A simple task');
        await driver.findElement(By.css('#edit-cost')).sendKeys('15');

        const validateButton = await driver.findElement(By.css('#edit-task-form > button'));
        validateButton.click();

        await driver.wait(until.stalenessOf(validateButton));

        const todo = await driver.findElement(By.css(`body > 
            div.container.vh-100.d-flex.flex-column > div > 
            div:nth-child(1) > div > div.card-body.p-2.overflow-auto`))
                .findElements(By.css('.card.mb-3.bg-light > .card-body.p-2 > p'));
        
        expect(todo.length).to.be.equal(1);

        await todo[0].getText().then((text) => expect(text).to.be.equal('A simple task'));

    }).timeout(20000);

    describe('Assigning no member to a task', () => {
        before(async function () {
            project.management.tasks = [];
            let member = await memberService.addMember(project._id, 'Marion', 'marion@testcdp.com', 'Testeur');
            let userStory = await userStoryService.addUS(project._id, null, 'A simle US', 1, 1);
            taskService.addTask(project._id, 'A simple task', 'GEN', 30, member._id, [ userStory._id ], []);
            return project.save();
        });
    
        after(async function() {
            const p = await projectService.getProjectByID(project._id);
            p.members = [];
            p.management.tasks = [];
            return p.save();
        });

        it('should not be possible to tick boxes of the DOD', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/tasks');

            await driver.findElement(By.css(`body > 
                div.container.vh-100.d-flex.flex-column > div > 
                div:nth-child(2) > div > div.card-body.p-2.overflow-auto`))
                    .findElement(By.css('.card.mb-3.bg-light > .card-body.p-2')).click();

            await driver.findElement(By.xpath('//*[@id="edit-members"]/option[1]')).click();

            const validateButton = await driver.findElement(By.css('#edit-task-form > button'));
            validateButton.click();

            await driver.wait(until.stalenessOf(validateButton));

            await driver.findElement(By.css(`body > 
                div.container.vh-100.d-flex.flex-column > div > 
                div:nth-child(2) > div > div.card-body.p-2.overflow-auto`))
                    .findElement(By.css('.card.mb-3.bg-light > .card-body.p-2')).click();

            const checkbox = await driver.findElements(By.css('.custom-control-input'));

            let bool = true;
            for(let box of checkbox){
                if(await box.isEnabled())
                    bool = false;
            }

            expect(bool).to.be.equal(true);
    
        }).timeout(20000);

    });

    describe('ticking all the boxes of the DOD', () => {
        before(async function () {
            project.management.tasks = [];
            let member = await memberService.addMember(project._id, 'Marion', 'marion@testcdp.com', 'Testeur');
            let userStory = await userStoryService.addUS(project._id, null, 'A simle US', 1, 1);
            taskService.addTask(project._id, 'A simple task', 'GEN', 30, member._id, [ userStory._id ], []);
            return project.save();
        });
    
        after(async function() {
            const p = await projectService.getProjectByID(project._id);
            p.members = [];
            p.management.tasks = [];
            return p.save();
        });

        it('should move the task to the section DONE', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/tasks');

            await driver.findElement(By.css(`body > 
                div.container.vh-100.d-flex.flex-column > div > 
                div:nth-child(2) > div > div.card-body.p-2.overflow-auto`))
                    .findElement(By.css('.card.mb-3.bg-light > .card-body.p-2')).click();

            const checkbox = await driver.findElements(By.className('custom-control custom-checkbox'));

            for(let box of checkbox)
                await box.click();

            const validateButton = await driver.findElement(By.css('#edit-task-form > button'));
            validateButton.click();

            await driver.wait(until.stalenessOf(validateButton));

            const wip = await driver.findElement(By.css(`body > 
                div.container.vh-100.d-flex.flex-column > div > 
                div:nth-child(2) > div > div.card-body.p-2.overflow-auto`))
                    .findElements(By.css('.card.mb-3.bg-light > .card-body.p-2 > p'));

            const done = await driver.findElement(By.css(`body > 
                div.container.vh-100.d-flex.flex-column > div > 
                div:nth-child(3) > div > div.card-body.p-2.overflow-auto`))
                    .findElements(By.css('.card.mb-3.bg-light > .card-body.p-2 > p'));

            expect(wip.length).to.be.equal(0);
            expect(done.length).to.be.equal(1);
    
        }).timeout(20000);

    });
});