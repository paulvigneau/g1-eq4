process.env.NODE_ENV = 'test';

const testProjects = require('./projects.test');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const { Builder, By } = require('selenium-webdriver');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

let driver = new Builder()
    .forBrowser('chrome')
    .build();

async function addMember(name, description, email, role) {
    await driver.get('http://localhost:3000');

    await driver.findElements(By.className('btn-primary'))
        .then(async element => {
            await element[0].click();
        });

    await driver.findElement(By.className('btn-primary'))
        .then(async element => {
            await element.click();
        });

    await driver.findElement(By.id('name'))
        .then(async element => {
            await element.sendKeys(name);
        });

    await driver.findElement(By.id('email'))
        .then(async element => {
            await element.sendKeys(email);
        });
}

//TODO
/*
describe('displayProject', () => {
    it('This should add a project, and check if it\'s page contains all it\'s information', async () => {
        await testProjects.saveProject('Projet 1', 'Ceci est un magnifique projet', '12-11-2020', '20-11-2020');
        await projectService.getAllProjects()
            .then(async projects => {

            });
        /*await driver.get('http://localhost:3000/projects/');

        await driver.findElements(By.className('card'))
            .then(async projects => {
                expect(projects.length).to.be.equal(2);
            });

        await driver.findElement(By.className('card-title')).getText()
            .then(async text => {
                expect(text).to.be.equal('Projet: Projet Test');
            });*/
/*
    });
});
*/

describe('addMember', () => {
    it('This should add a project, then add a member', async () => {
        await testProjects.saveProject('Projet 1', 'Ceci est un magnifique projet', '12-11-2020', '20-11-2020');


        await driver.findElements(By.className('card'))
            .then(async projects => {
                expect(projects.length).to.be.equal(1);
            });

        await driver.findElement(By.className('card-title')).getText()
            .then(async text => {
                expect(text).to.be.equal('Projet: Projet 1');
            });

        /*driver.wait(selenium.until.elementLocated(selenium.By.className('card-title'), timeOut)).then(function () {
            return driver.findElement(selenium.By.name('project_cdp'));
        });*/

    }).timeout(6000);
});
