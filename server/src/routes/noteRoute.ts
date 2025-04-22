import { Router } from "express";
import { CreateNote, DeleteNote, GetAllNotes, GetNote, UpdateNote } from "../controllers/noteController";
import { INote, Note } from "../models/noteModel";

const NoteRouter: Router = Router()

NoteRouter.get('/note', async (req, res) => {
    let notes: INote[] = await GetAllNotes();
    res.send(notes);
})

NoteRouter.get('/note/:id', async (req, res) => {
    const id: string = req.params.id;
    let note: INote = await GetNote(id);
    res.send(note);
})

NoteRouter.post('/note', async (req, res) => {
    const note: INote = req.body.note as INote;
    await CreateNote(note);
    res.sendStatus(200);
})

NoteRouter.delete('/note/:id', async (req, res) => {
    const id: string = req.params.id;
    await DeleteNote(id);
    res.send(200);
})

NoteRouter.put('/note', async (req, res) => {
    const note: Note = req.body as Note;
    await UpdateNote(note);
    res.sendStatus(200);
})
export { NoteRouter };
