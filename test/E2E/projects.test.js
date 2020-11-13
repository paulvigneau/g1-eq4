process.env.NODE_ENV = 'test';

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

async function saveProject(name, description, start, end) {
    await driver.get('http://localhost:3000/new-project');

    await driver.findElement(By.id('name'))
        .then(async element => {
            await element.sendKeys(name);
        });

    await driver.findElement(By.id('description'))
        .then(async element => {
            await element.sendKeys(description);
        });

    await driver.findElement(By.id('start'))
        .then(async element => {
            await element.sendKeys(start);
        });

    await driver.findElement(By.id('end'))
        .then(async element => {
            await element.sendKeys(end);
        });

    await driver.findElement(By.css('body > form > button'))
        .then(async element => {
            await element.click();
        });
}

describe('New project page', () => {
    it('should be redirected to the creation page of projects', async () => {
        await driver.get('http://localhost:3000');

        await driver.findElements(By.className('btn-success'))
            .then(async elements => {
                await elements[0].click();

                driver.getCurrentUrl().then(url => {
                    expect(url.includes('/new-project')).true;
                });
            });
    }).timeout(10000);
});

describe('createProject & displayProjects', () => {
    it('should add a project and display it in homepage', async () => {
        await saveProject('Projet 1', 'Ceci est un magnifique projet', '12-11-2020', '20-11-2020');

        await driver.findElements(By.className('card'))
            .then(async projects => {
                expect(projects.length).to.be.equal(1);
            });

        await driver.findElement(By.className('card-title')).getText()
            .then(async text => {
                expect(text).to.be.equal('Projet: Projet 1');
            });

    }).timeout(10000);
});

after(function(done) {
    driver.quit();
    mongoose.model('project').deleteMany({}, done);
});

module.exports = { saveProject };
