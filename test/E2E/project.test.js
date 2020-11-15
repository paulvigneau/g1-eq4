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
        await driver.findElement(By.xpath('.//*[@id="role"]/option[1]')).click();
    }
    if(role === 'Testeur'){
        await driver.findElement(By.xpath('.//*[@id="role"]/option[2]')).click();
    }
    if(role === 'Product Owner'){
        await driver.findElement(By.xpath('.//*[@id="role"]/option[3]')).click();
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
        await projectService.getProjectByName('Projet 3')
            .then(async project => {
                await saveMember(project._id, 'Bob', 'John@Doe.com', 'Testeur');
                await driver.get('http://localhost:3000/projects/' + project._id);
                await driver.findElement(By.name('name')).getText()
                    .then(async text => {
                        expect(text).to.be.equal('Nom : Bob');
                    });
                await driver.findElement(By.name('role')).getText()
                    .then(async text => {
                        expect(text).to.be.equal('Rôle : Testeur');

                    });
                await driver.findElement(By.name('email')).getText()
                    .then(async text => {
                        expect(text).to.be.equal('Email : John@Doe.com');
                    });
            });
    }).timeout(10000);
});

describe('displayProject', () => {
    it('This should add a project, and verify that it\'s information are in the homepage', async () => {
        await testProjects.saveProject('Projet 4', 'Projet magnifique', '12-11-2020', '20-11-2020');

        await projectService.getProjectByName('Projet 4')
            .then(async project => {
                await driver.get('http://localhost:3000/projects/' + project._id);
                await driver.findElement(By.className('projName')).getText()
                    .then(async text => {
                        expect(text).to.be.equal('Nom du projet : ' + 'Projet 4');
                    });
                await driver.findElement(By.className('projDescription')).getText()
                    .then(async text => {
                        expect(text).to.be.equal('Description : ' + 'Projet magnifique');
                    });
            });

    }).timeout(10000);
});

describe('Redirection to new-member page', () => {
    it('Add a project, redirect to it\'s homepage, and click on button to redirect to new-member page', async () => {
        await testProjects.saveProject('Projet 5', 'Projet magnifique', '12-11-2020', '20-11-2020');

        await projectService.getProjectByName('Projet 5')
            .then(async project => {
                await driver.get('http://localhost:3000/projects/' + project._id);
                await driver.findElement(By.className('btn btn-primary'))
                    .then(async element => {
                        await element.click();

                        driver.getCurrentUrl().then( url => {
                            expect(url.includes('/projects/' + project._id + '/new-member')).true;
                        });
                    });
            });

    }).timeout(10000);
});

describe('deleteMember', () => {
    it('This should delete a member', async () => {
        await testProjects.saveProject('Projet 6', 'Encore un magnifique projet', '12-11-2020', '20-11-2020');

        await projectService.getProjectByName('Projet 6')
            .then(async project => {
                await saveMember(project._id, 'Bob', 'John@Doe.com', 'Testeur');

                await driver.get('http://localhost:3000/projects/' + project._id);

                await driver.findElement(By.className('btn btn-success btn-danger'))
                    .then(async element => {
                        await element.click();

                        driver.findElements(By.className('col'))
                            .then(async members => {
                                expect(members.length).to.be.equal(0);
                            });
                    });
            });
    }).timeout(10000);
});

describe('navigationBar', () => {
    it('Click on every element from the navigation bar, and test if we are redirected to the good pages', async () => {
        await projectService.getProjectByName('Projet 6')
            .then(async project => {
                await driver.get('http://localhost:3000/projects/' + project._id);
                await driver.findElements(By.className('nav-link'))
                    .then(async elements => {
                        //localhost://3000
                        await elements[0].click();

                        driver.getCurrentUrl().then( url => {
                            expect(url.includes('http://localhost:3000')).true;
                        });
                    });
            });
    }).timeout(10000);
});

after(function(done) {
    driver.quit();
    mongoose.model('project').deleteMany({}, done);
});
