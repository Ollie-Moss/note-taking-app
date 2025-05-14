import config from '../config/config';
config;

import request from 'supertest';
import mongoose, { disconnect, Types } from 'mongoose';
import app from '../../src/app';
import { Note, NoteModel, INote } from '../../src/models/noteModel';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import InitializeMongoose from '../db/conn';
import { User, UserModel } from '../models/userModel';



describe('Note API Routes', () => {
    let userId: Types.ObjectId;
    let noteId: Types.ObjectId;

    const testUser: User = {
        _id: new Types.ObjectId(),
        name: "ollie",
        email: "email",
        password_hash: "abc"
    }
    const testNote: INote = {
        title: "Test Note",
        contents: "{}",
        favourite: false,
        editedAt: new Date(Date.now()),
        position: 100,
        uid: testUser._id,
        parentId: null
    }

    beforeAll(async () => {
        // Connect to test DB or use MongoMemoryServer
        await InitializeMongoose(process.env.TEST_DB_ATLAS_URI);

        const newUser: User = await UserModel.create(testUser)
        userId = newUser._id

        const note = await NoteModel.create(testNote);
        noteId = note._id;
    });

    afterAll(async () => {
        await disconnect();
    });

    describe('GET /api/note', () => {
        it('should return all notes', async () => {
            const res = await request(app).get('/api/note').set('Authorization', `Bearer ${userId}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.notes)).toBe(true);
        });
    });

    describe('GET /api/note/:id', () => {
        it('should return a single note', async () => {
            const res = await request(app).get(`/api/note/${noteId}`).set('Authorization', `Bearer ${userId}`);
            expect(res.status).toBe(200);
            expect(res.body.note._id).toBe(noteId.toString());
        });

        it('should return 404 for non-existing note', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/note/${fakeId}`).set('Authorization', `Bearer ${userId}`);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /api/note', () => {
        it('should create a new note', async () => {
            const res = await request(app)
                .post('/api/note')
                .set('Authorization', `Bearer ${userId}`)
                .send({ note: testNote });

            expect(res.status).toBe(200);
            expect(res.body.note.title).toBe('Test Note');
        });
    });

    describe('PUT /api/note', () => {
        it('should update a note', async () => {
            const updated = { ...testNote, _id: noteId, title: 'Updated Note' };
            const res = await request(app)
                .put('/api/note')
                .set('Authorization', `Bearer ${userId}`)
                .send({ note: updated });

            expect(res.status).toBe(200);
            expect(res.body.note.title).toBe('Updated Note');
        });
    });

    describe('PUT /api/note/move', () => {
        it('should move a note to the end if no before/after IDs', async () => {
            const res = await request(app)
                .put('/api/note/move')
                .set('Authorization', `Bearer ${userId}`)
                .send({ note: testNote });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Note moved!');
        });

        it('should move a note between others if beforeId and afterId are provided', async () => {
            const note = await NoteModel.create({ ...testNote, position: 300 });
            const noteA = await NoteModel.create({ ...testNote, position: 100 });
            const noteB = await NoteModel.create({ ...testNote, position: 200 });

            const res = await request(app)
                .put('/api/note/move')
                .set('Authorization', `Bearer ${userId}`)
                .send({ note, beforeId: noteA._id, afterId: noteB._id });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Note moved!');
            expect(res.body.note.position).toBe(150);
        });
    });

    describe('DELETE /api/note/:id', () => {
        it('should delete a note', async () => {
            const toDelete = await NoteModel.create(testNote);
            const res = await request(app)
                .delete(`/api/note/${toDelete._id}`)
                .set('Authorization', `Bearer ${userId}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Note deleted!');
        });
    });
});

