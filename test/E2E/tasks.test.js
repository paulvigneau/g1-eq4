process.env.NODE_ENV = 'test';

require('../../app');
const projectService = require('../../services/projectService');
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

        const todoTasks = await driver.findElement(By.css(`body > 
            div.container.vh-100.d-flex.flex-column > div > 
            div:nth-child(1) > div > div.card-body.p-2.overflow-auto`))
                .findElements(By.css('.card.mb-3.bg-light > .card-body.p-2 > p'));
        
        expect(todoTasks.length).to.be.equal(1);

        await todoTasks[0].getText().then((text) => expect(text).to.be.equal('A simple task'));

    }).timeout(20000);
});