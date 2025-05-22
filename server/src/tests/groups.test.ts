import config from '../config/config';
config;

import request from 'supertest';
import mongoose, { disconnect, Types } from 'mongoose';
import app from '../../src/app';
import { Group, GroupModel, IGroup } from '../../src/models/groupModel';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import InitializeMongoose from '../db/conn';
import { User, UserModel } from '../models/userModel';



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
        open: true
    }

    beforeAll(async () => {

        // Connect to test DB or use MongoMemoryServer
        await InitializeMongoose(process.env.ATLAS_URI);

        const newUser: User = await UserModel.create(testUser)
        userId = newUser._id

        const group = await GroupModel.create(testGroup);
        groupId = group._id;
    });

    afterAll(async () => {
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

    describe('PATCH /api/group', () => {
        it('should update a group', async () => {
            const updated = { ...testGroup, _id: groupId, title: 'Updated Group' };
            const res = await request(app)
                .patch('/api/group')
                .set('Authorization', `Bearer ${userId}`)
                .send({ group: updated });

            expect(res.status).toBe(200);
            expect(res.body.group.title).toBe('Updated Group');
        });
    });

    describe('PATCH /api/group/move', () => {
        it('should move a group after the target note', async () => {
            await GroupModel.deleteMany({});
            const targetGroup = await GroupModel.create({ ...testGroup, position: 100 });
            const anotherGroup = await GroupModel.create({ ...testGroup, position: 200 });
            const group = await GroupModel.create({ ...testGroup, position: 300 });

            const res = await request(app)
                .patch(`/api/group/move?targetId=${targetGroup._id}&position=after`)
                .set('Authorization', `Bearer ${userId}`)
                .send({ group });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Group moved!');
            expect(res.body.group.position).toBe(150);
        });

        it('should move a group before the target note', async () => {
            await GroupModel.deleteMany({});
            const targetGroup = await GroupModel.create({ ...testGroup, position: 100 });
            const group = await GroupModel.create({ ...testGroup, position: 200 });

            const res = await request(app)
                .patch(`/api/group/move?targetId=${targetGroup._id}&position=before`)
                .set('Authorization', `Bearer ${userId}`)
                .send({ group });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Group moved!');
            expect(res.body.group.position).toBe(50);
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

