import config, { initConfig } from './config/config';
import request from 'supertest';
import mongoose, { connection, disconnect, Types } from 'mongoose';
import app from '../src/app'; // Make sure to export app from your main server file
import { Group, GroupModel, IGroup } from '../src/models/groupModel';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import InitializeMongoose from './db/conn';
import { CreateUser } from './controllers/userController';
import { User, UserModel } from './models/userModel';
import { group } from 'console';



describe('Group API Routes', () => {
    let userId: Types.ObjectId;
    let groupId: Types.ObjectId;

    const testUser: User = {
        _id: new Types.ObjectId(),
        name: "ollie",
        email: "email",
        password_hash: "abc"
    }
    const testGroup: IGroup = {
        title: "Test Group",
        position: 100,
        uid: testUser._id,
        parentId: null,
    }

    beforeAll(async () => {

        initConfig()
        // Connect to test DB or use MongoMemoryServer
        await InitializeMongoose(process.env.TEST_DB_ATLAS_URI);

        const newUser: User = await UserModel.create(testUser)
        userId = newUser._id

        const group = await GroupModel.create(testGroup);
        groupId = group._id;
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await disconnect();
    });

    describe('GET /api/group', () => {
        it('should return all groups', async () => {
            const res = await request(app).get('/api/group').set('Authorization', `Bearer ${userId}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.groups)).toBe(true);
        });
    });

    describe('GET /api/group/:id', () => {
        it('should return a single group', async () => {
            const res = await request(app).get(`/api/group/${groupId}`).set('Authorization', `Bearer ${userId}`);
            expect(res.status).toBe(200);
            expect(res.body.group._id).toBe(groupId.toString());
        });

        it('should return 404 for non-existing group', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/group/${fakeId}`).set('Authorization', `Bearer ${userId}`);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /api/group', () => {
        it('should create a new group', async () => {
            const res = await request(app)
                .post('/api/group')
                .set('Authorization', `Bearer ${userId}`)
                .send({ group: testGroup });

            expect(res.status).toBe(200);
            expect(res.body.group.title).toBe('Test Group');
        });
    });

    describe('PUT /api/group', () => {
        it('should update a group', async () => {
            const updated = { ...testGroup, _id: groupId, title: 'Updated Group' };
            const res = await request(app)
                .put('/api/group')
                .set('Authorization', `Bearer ${userId}`)
                .send({ group: updated });

            expect(res.status).toBe(200);
            expect(res.body.group.title).toBe('Updated Group');
        });
    });

    describe('PUT /api/group/move', () => {
        it('should move a group to the end if no before/after IDs', async () => {
            const res = await request(app)
                .put('/api/group/move')
                .set('Authorization', `Bearer ${userId}`)
                .send({ group: testGroup });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Group moved!');
        });

        it('should move a group between others if beforeId and afterId are provided', async () => {
            const group = await GroupModel.create({ ...testGroup, position: 250 });
            const groupA = await GroupModel.create({ ...testGroup, position: 50 });
            const groupB = await GroupModel.create({ ...testGroup, position: 150 });

            const res = await request(app)
                .put('/api/group/move')
                .set('Authorization', `Bearer ${userId}`)
                .send({ group, beforeId: groupA._id, afterId: groupB._id });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Group moved!');
        });
    });

    describe('DELETE /api/group/:id', () => {
        it('should delete a group', async () => {
            const toDelete = await GroupModel.create(testGroup);
            const res = await request(app)
                .delete(`/api/group/${toDelete._id}`)
                .set('Authorization', `Bearer ${userId}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Group deleted!');
        });
    });
});

