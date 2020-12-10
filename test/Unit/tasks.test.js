process.env.NODE_ENV = 'test';

const app = require('../../app');
const mongoose = require('mongoose');
const dbConfig = require('../../config/db');
const assert = require('assert');
const taskService = require('../../services/taskService');
const chai = require('chai');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(dirtyChai);

describe('Tasks unit tests', () => {
    before('connect', async () => {
        await dbConfig.connectToDB();
    });

    describe('Get tasks', () => {
        it('should return code 200');
        it('should return code 200 and retrieve all the tasks');
        it('should get all the tasks');
        it('should get task by id');
    });

    describe('Add task', () => {
        it('should return code 200');
        it('should return code 400 because some params are missing');
        it('should return code 404 because project does not exist');
        it('should return code 404 because US sent does not exist');
        it('should return code 404 because tasks sent does not exist');
        it('should return code 404 because member assigned does not exist');
        it('should add a task');
        it('should add a task with member and should move to WIP status');
    });

    describe('Update task', () => {
        it('should return code 200');
        it('should return code 400 because some params are missing');
        it('should return code 400 when trying to edit task because task has WIP status');
        it('should return code 404 because project does not exist');
        it('should return code 404 because US sent does not exist');
        it('should return code 404 because tasks sent does not exist');
        it('should return code 404 because member assigned does not exist');
        it('should add a member to a task');
        it('should remove the member of a task');
        it('should validate the DOD of a task and should move to DONE');
        it('should validate the DOD of a task and do not move because dependencies are not DONE');
    });
});
