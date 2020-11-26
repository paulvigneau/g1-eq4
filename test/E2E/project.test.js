process.env.NODE_ENV = 'test';

const projectService = require('../../services/project');
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

describe('Project End to End', () => {
    before(async function () {
        driver = await new Builder()
            .forBrowser('chrome')
            .build();

        project = await projectService.addProject({
            name: 'Projet',
            description: 'Un magnifique project',
            start: '01-01-2070',
            end: '01-02-2070',
        });
    });

    after(function (done) {
        driver.quit();
        mongoose.model('project').deleteMany({}, done);
    });

    describe('Add member to project, display his information and delete this member', () => {
        it('should add a member', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id);

            await driver.findElement(By.css('.btn.btn-primary')).click();

            let display = await driver.findElement(By.css('.pop-up-wrapper')).getCssValue('display');
            expect(display).to.be.equal('block');

            await driver.findElement(By.css('.pop-up-wrapper #name')).sendKeys('Bob');
            await driver.findElement(By.css('.pop-up-wrapper #email')).sendKeys('bob@mail.com');
            await driver.findElement(By.xpath('.//*[@id="role"]/option[2]')).click();

            await driver.findElement(By.css('.pop-up-wrapper button.btn[type=\'submit\']')).click();

            await driver.wait(
                async () => await driver.findElement(By.css('.pop-up-wrapper')),
                10000
            );
        }).timeout(20000);

        it('should display member\'s information', async () => {
            const member = await driver.findElement(By.xpath('.//table[@class="table"]//tbody//tr'));
            const rows = await member.findElements(By.css('td'));
            const name = await member.findElement(By.id('name'));

            await name.getText()
                .then(async text => {
                    expect(text).to.be.equal('Bob');
                });
            await rows[0].getText()
                .then(async text => {
                    expect(text).to.be.equal('Testeur');
                });
            await rows[1].getText()
                .then(async text => {
                    expect(text).to.be.equal('bob@mail.com');

                });
        });

        it('should delete the member', async () => {
            await driver.findElement(By.css('table td > .btn.btn-danger')).click();
            await driver.get('http://localhost:3000/projects/' + project._id);

            await driver.wait(
                async () => await driver.findElement(By.css('.container')),
                10000
            );

            await driver.findElements(By.css('.table > tbody > tr'))
                .then(members => {
                    expect(members.length).to.be.equal(0); // Sometimes it will be to fast and fail
                });
        }).timeout(20000);
    });

    describe('Display project information', () => {
        it('should display project\'s information are in the homepage', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id);

            await driver.findElement(By.className('projName')).getText()
                .then(async text => {
                    expect(text).to.be.equal(project.name);
                });
            await driver.findElement(By.className('projDescription')).getText()
                .then(async text => {
                    expect(text).to.be.equal(project.description);
                });
        }).timeout(20000);
    });

    describe('Click on every element from the navigation bar', () => {
        it('should test if we are redirected to the good pages', async () => {
            await driver.get('http://localhost:3000/projects/' + project._id);

            await driver.findElement(By.linkText('Accueil'))
                .then(async navLinkElement => {
                    await navLinkElement.click();
                    await driver.getCurrentUrl().then(url => {
                        expect(url).to.be.equal('http://localhost:3000/');
                    });
                });

            await driver.get('http://localhost:3000/projects/' + project._id);

            await driver.findElement(By.linkText('Projet'))
                .then(async navLinkElement => {
                    await navLinkElement.click();
                    await driver.getCurrentUrl().then(url => {
                        expect(url).to.be.equal('http://localhost:3000/projects/' + project._id);
                    });
                });

            await driver.get('http://localhost:3000/projects/' + project._id);

            await driver.findElement(By.linkText('Backlog'))
                .then(async navLinkElement => {
                    await navLinkElement.click();
                    await driver.getCurrentUrl().then(url => {
                        expect(url).to.be.equal('http://localhost:3000/projects/' + project._id + '/backlog');
                    });
                });

            await driver.get('http://localhost:3000/projects/' + project._id);

            await driver.findElement(By.linkText('Tâches'))
                .then(async navLinkElement => {
                    await navLinkElement.click();
                    await driver.getCurrentUrl().then(url => {
                        expect(url).to.be.equal('http://localhost:3000/projects/' + project._id + '/tasks');
                    });
                });

            await driver.get('http://localhost:3000/projects/' + project._id);

            await driver.findElement(By.linkText('Tests'))
                .then(async navLinkElement => {
                    await navLinkElement.click();
                    await driver.getCurrentUrl().then(url => {
                        expect(url).to.be.equal('http://localhost:3000/projects/' + project._id + '/tests');
                    });
                });

            await driver.get('http://localhost:3000/projects/' + project._id);

            await driver.findElement(By.linkText('Documentation'))
                .then(async navLinkElement => {
                    await navLinkElement.click();
                    await driver.getCurrentUrl().then(url => {
                        expect(url).to.be.equal('http://localhost:3000/projects/' + project._id + '/documentations');
                    });
                });

            await driver.get('http://localhost:3000/projects/' + project._id);

            await driver.findElement(By.linkText('Release'))
                .then(async navLinkElement => {
                    await navLinkElement.click();
                    await driver.getCurrentUrl().then(url => {
                        expect(url).to.be.equal('http://localhost:3000/projects/' + project._id + '/releases');
                    });
                });
        }).timeout(20000);
    });
});
