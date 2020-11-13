process.env.NODE_ENV = 'test';

const testProjects = require('./projects.test');
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

before(function () {
    driver = new Builder()
        .forBrowser('chrome')
        .build();
});

async function saveMember(projectId, name, email, role) {
    await driver.get('http://localhost:3000/projects/' + projectId + '/new-member');

    await driver.findElement(By.id('name'))
        .then(async element => {
            await element.sendKeys(name);
        });

    await driver.findElement(By.id('email'))
        .then(async element => {
            await element.sendKeys(email);
        });

    if(role === 'Développeur'){
        await driver.findElement(By.xpath('.//*[@id="role"]/option[0]')).click();
    }
    if(role === 'Testeur'){
        await driver.findElement(By.xpath('.//*[@id="role"]/option[1]')).click();
    }
    if(role === 'Product Owner'){
        await driver.findElement(By.xpath('.//*[@id="role"]/option[2]')).click();
    }

    await driver.findElements(By.className('btn-success'))
        .then(async elements => {
            await elements[0].click();
        });
}

describe('Project redirection to homepage', () => {
    it('This should add a project, and verify if we are redirected to it\'s homepage', async () => {
        await testProjects.saveProject('Projet 2', 'Projet magnifique', '12-11-2020', '20-11-2020');
        await driver.get('http://localhost:3000/');

        await projectService.getAllProjects()
            .then(async projects => {
                 for(let i = 0; i < projects.length; i++){
                    let project = projects[i];
                    if(project.name === 'Projet 2'){
                        await driver.findElements(By.className('btn btn-primary stretched-link'))
                            .then(async elements => {
                                await elements[i].click();

                                driver.getCurrentUrl().then( url => {
                                    expect(url.includes('/projects/' + project._id)).true;
                                });
                            });
                    }
                }
            });

    }).timeout(10000);
});


describe('addMember', () => {
    it('This should add a member', async () => {
        await testProjects.saveProject('Projet 3', 'Encore un magnifique projet', '12-11-2020', '20-11-2020');
        await projectService.getAllProjects()
            .then(async projects => {
                for(let i = 0; i < projects.length; i++) {
                    let project = projects[i];
                    if (project.name === 'Projet 3') {
                        await saveMember(project._id, 'Bob', 'John@Doe.com', 'Testeur');
                        await driver.get('http://localhost:3000/projects/' + project._id);
                        await driver.findElements(By.name('name'))
                            .then(async elements => {
                                expect(elements[0]).to.be.equal('Nom : Bob');
                                expect(elements[1]).to.be.equal('Rôle : Testeur');
                                expect(elements[2]).to.be.equal('Email : John@Doe.com');
                            });
                    }
                    break;
                }
            });
    }).timeout(10000);
});

after(function(done) {
    driver.quit();
    mongoose.model('project').deleteMany({}, done);
});
