process.env.NODE_ENV = 'test';

const app = require('../app');
const mongoose = require('mongoose');
const assert = require('assert');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
let projectService = require('../services/project');
const { Builder, By } = require('selenium-webdriver');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

let driver = new Builder()
    .forBrowser('chrome')
    .build();

describe('Projects unit tests', () => {

    it('should get all the project stored', async () => {
        const projects = await projectService.getAllProjects();

        mongoose.model('project').find({}).exec((err, expectedProjects) => {
            if (err)
                assert.fail();
            else {
                assert(expectedProjects.length === projects.length);
            }
        });
    });

    it('should get return status 200', async () => {
        let res = await chai
            .request(app)
            .get('/')
            .send();

        expect(res.status).to.equal(200);
    });


    it('should add a new project in database', async () => {
        let res = await chai
            .request(app)
            .post('/project')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                name: 'Projet Test',
                description: 'Description de projet de test',
                start: '2020-11-10',
                end: '2020-11-20'
            });

        expect(res.status).to.equal(200);

        const projects = await projectService.getAllProjects();
        assert(projects.find(
            (p) => p.name === 'Projet Test'
                && p.description === 'Description de projet de test'
                && new Date(p.start).valueOf() === new Date('2020-11-10').valueOf()
                && new Date(p.end).valueOf() === new Date('2020-11-20').valueOf()
        ));
    });
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

                driver.getCurrentUrl().then( url => {
                    expect(url.includes('/new-project')).true;
                });
            });
    });
});

describe('createProject & displayProjects', () => {
    it('should add a project and display it in homepage', async () => {
        await saveProject('Projet 1', 'Ceci est un magnifique projet', '12-11-2020', '20-11-2020');
        await driver.get('http://localhost:3000/');

        await driver.findElements(By.className('card'))
            .then(async projects => {
                expect(projects.length).to.be.equal(2);
            });

        await driver.findElement(By.className('card-title')).getText()
            .then(async text => {
                expect(text).to.be.equal('Projet: Projet Test');
        });
    });
});

after(function(done) {
    mongoose.model('project').deleteMany({}, (err) => {
        console.log(err);
        mongoose.connection.close(done);
    });
});

module.exports = { saveProject };
