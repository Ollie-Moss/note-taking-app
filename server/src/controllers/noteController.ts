import { NextFunction, Request, Response } from "express";
import { INote, NoteModel, Note } from "../models/noteModel";
import { AppError } from "../middlewares/errorHandler";
import { Types } from "mongoose";


// ----- CREATE ------

export async function CreateNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.body?.note) return next();

        const newNote: INote = req.body.note as INote;

        if (!Types.ObjectId.isValid(newNote.uid)) {
            throw new AppError("Invalid uid provided!", 404);
        }

        const validNote: INote = {
            title: newNote.title,
            contents: newNote.contents,
            uid: newNote.uid
        }
        const note: INote = await CreateNote(validNote);
        res.status(200).send({ message: "Note created!", note: note });
    } catch (error) {
        next(error)
    }
}

export async function CreateNote(note: INote): Promise<INote> {
    console.log(note);
    const newNote: INote = await NoteModel.create(note)
        .then(data => data.toObject({ versionKey: false }));
    return newNote;
}

// ----- READ ------

export async function GetAllNotesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const uid: string = req.user._id;
        let notes: INote[] = await GetAllNotesForUser(uid);
        res.status(200).send({ notes: notes });
    } catch (error) {
        next(error)
    }
}

export async function GetAllNotes(): Promise<INote[]> {
    const notes: INote[] = await NoteModel.find({})
        .then(data => data.map(note => note.toObject({ versionKey: false })));
    return notes;
}
export async function GetAllNotesForUser(uid: string): Promise<INote[]> {
    const notes: INote[] = await NoteModel.find({ uid: uid })
        .then(data => data.map(note => note.toObject({ versionKey: false })));
    return notes;
}


export async function GetNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: string = req.params.id;
        let note: INote | null = await GetNote(req.user._id, id);
        if (note === null) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
        res.status(200).json({ note: note });
    } catch (error) {
        next(error)
    }
}

export async function GetNote(uid: string, id: string): Promise<INote | null> {
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid note id provided!", 404);
    }
    const note: INote | null = await NoteModel.findOne({ _id: id, uid: uid })
        .then(data => data?.toObject({ versionKey: false }) ?? null)
    return note;
};


// ----- UPDATE ------

export async function UpdateNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const newNote: Note = req.body.note as Note;
        const note: INote | null = await UpdateNote(req.user._id, newNote);
        if (note === null) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
        res.status(200).json({ message: "Note updated!", note: note });
    } catch (error) {
        next(error)
    }
}

export async function UpdateNote(uid: string, note: Note): Promise<INote | null> {
    const updatedNote: INote | null = await NoteModel.findOneAndUpdate({ _id: note._id, uid: uid }, note)
        .then(data => data?.toObject({ versionKey: false }) ?? null);
    return updatedNote;
}


// ----- DELETE ------

export async function DeleteNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: string = req.params.id;
        const note: INote | null = await DeleteNote(req.user._id, id);
        if (note === null) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
        res.status(200).json({ message: "Note deleted!", note: note });
    } catch (error) {
        next(error)
    }
}

export async function DeleteNote(uid: string, id: string): Promise<INote | null> {
    const note: INote | null = await NoteModel.findOneAndDelete({ _id: id, uid: uid })
        .then(data => data?.toObject({ versionKey: false }) ?? null);
    return note;
}
