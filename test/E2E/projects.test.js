process.env.NODE_ENV = 'test';

const chai = require('chai');
const projectService = require('../../services/project');
const mongoose = require('mongoose');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const { Builder, By } = require('selenium-webdriver');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);
let driver;

describe('Add new project and display it in homepage', () => {
    before(function () {
        return driver = new Builder()
            .forBrowser('chrome')
            .build();
    });

    after(function(done) {
        driver.quit();
        mongoose.model('project').deleteMany({}, done);
    });

    it('should add a project and display it in homepage', async () => {
        await driver.get('http://localhost:3000');

        await driver.findElement(By.css('.btn.btn-success')).click();

        let display = await driver.findElement(By.css('.pop-up-wrapper')).getCssValue('display');
        expect(display).to.be.equal('block');

        await driver.findElement(By.css('.pop-up-wrapper #name')).sendKeys('Projet 1');
        await driver.findElement(By.css('.pop-up-wrapper #description')).sendKeys('Ceci est un magnifique projet');
        await driver.findElement(By.css('.pop-up-wrapper #start')).sendKeys('01-01-2070');
        await driver.findElement(By.css('.pop-up-wrapper #end')).sendKeys('01-02-2070');

        await driver.findElement(By.css('.pop-up-wrapper button.btn[type=\'submit\']')).click();

        await driver.wait(
            async () => await driver.findElement(By.css('.pop-up-wrapper')),
            10000
        );

        display = await driver.findElement(By.css('.pop-up-wrapper')).getCssValue('display');
        expect(display).to.be.equal('none');
    }).timeout(15000);

    it('should display the new project in homepage', async () => {
        await driver.findElements(By.css('body > div > div.row.justify-content-start > div'))
            .then(async projects => {
                expect(projects.length).to.be.equal(1);
            });

        await driver.findElement(By.className('card-title')).getText()
            .then(async text => {
                expect(text).to.be.equal('Projet 1');
            });
    });

    it('it should click on the project and be redirected to it\'s homepage', async () => {
        let project = await projectService.getProjectByName('Projet 1');

        await driver.findElement(By.className('card-body')).click();
        driver.getCurrentUrl().then( url => {
            expect(url).to.be.equal('/projects/' + project._id);
        });
    }).timeout(10000);
});

/**
 * @deprecated Use service instead
 */
async function saveProject(name, description, start, end) {
    await driver.get('http://localhost:3000');

    await driver.findElement(By.css('.btn.btn-success')).click();

    let display = await driver.findElement(By.css('.pop-up-wrapper')).getCssValue('display');
    expect(display).to.be.equal('block');

    await driver.findElement(By.css('.pop-up-wrapper #name')).sendKeys(name);
    await driver.findElement(By.css('.pop-up-wrapper #description')).sendKeys(description);
    await driver.findElement(By.css('.pop-up-wrapper #start')).sendKeys(start);
    await driver.findElement(By.css('.pop-up-wrapper #end')).sendKeys(end);

    await driver.findElement(By.css('.pop-up-wrapper button.btn[type=\'submit\']')).click();

    await driver.wait(
        async () => await driver.findElement(By.css('.pop-up-wrapper')),
        10000
    );

    display = await driver.findElement(By.css('.pop-up-wrapper')).getCssValue('display');
    expect(display).to.be.equal('none');
}

module.exports = { saveProject };
