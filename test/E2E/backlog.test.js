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

describe('Backlog End to End', () => {
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

    describe('Modification of a user story', () => {
        after(async function () {
            const p = await projectService.getProjectByID(project._id);
            p.management.backlog.backlog = [];
            return p.save();
        });

        before(async function () {
            await userStoryService.addUS(project._id, null, 'En tant que..., je souhaite pouvoir..., afin de...', 3);
        });

        it('should modify the description and the difficulty of the user story', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id + '/backlog');

            await driver.findElement(By.css('#backlog > div > div > span.us-more.col')).click();
            await driver.findElement(By.className('edit-us-button')).click();

            await driver.findElement(By.css('#edit-description')).clear();
            await driver.findElement(By.css('#edit-description')).sendKeys('Modified');
            await driver.findElement(By.css('#edit-difficulty > option:nth-child(1)')).click();

            const modifyButton = await driver.findElement(By.css('#edit-us-form > button.btn.btn-success'));
            await modifyButton.click();

            await driver.wait(until.stalenessOf(modifyButton));
            
            const usDescription = await driver.findElement(By.css('#userStoryDescription'))
                .getAttribute('title');
            const usDifficulty = await driver.findElement(By.css('#userStoryDifficulty'))
                .getText();

            expect(usDescription).to.be.equal('Modified');
            expect(usDifficulty).to.be.equal('1');
            
        }).timeout(20000);
    });
});