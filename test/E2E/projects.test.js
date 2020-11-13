process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const assert = require('assert');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
let projectService = require('../../services/project');
const {Builder, By, until, Key} = require('selenium-webdriver');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

let driver = new Builder()
    .forBrowser('chrome')
    .build();

async function saveProject(name, description, start, end) {
    await driver.get('http://localhost:3000');

    await driver.findElements(By.className('btn-success'))
        .then(async element => {
            await element.click();
        });

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
    it('We should be redirected to the creation page of projects', async () => {
        await driver.get('http://localhost:3000');

        await driver.findElements(By.className('btn-success'))
            .then(async elements => {
                await elements[0].click();

                driver.getCurrentUrl().then( url => {
                    expect(url.includes('/new-project')).true;
                });
            });
    });
});

describe('createproject & displayProjects', () => {
    it('This should add a project and display it in homepage', async () => {
        await saveProject('Projet 1', 'Ceci est un magnifique projet', '12-11-2020', '20-11-2020');
        //await driver.get('http://localhost:3000/');
        /*
        await driver.findElements(By.className('card'))
            .then(async projects => {
                expect(projects.length).to.be.equal(2);
            });
*/
        /*await driver.findElement(By.className('card-title')).getText()
            .then(async text => {
                expect(text).to.be.equal('Projet: Projet Test');
            });

        driver.wait(selenium.until.elementLocated(selenium.By.className('card-title'), timeOut)).then(function () {
            return driver.findElement(selenium.By.name('project_cdp'));
        });*/

    });
});

after(function(done) {
    mongoose.model('project').deleteMany({}, () => {
        mongoose.connection.close(done);
    });
});
