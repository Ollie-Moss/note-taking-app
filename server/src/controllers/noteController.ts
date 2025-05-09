import { Request, Response, NextFunction } from "express";
import { Note, NoteModel, INote } from "../models/noteModel";
import { Types } from "mongoose";
import { AppError } from "../middlewares/errorHandler";

// ----- API Route Handlers ------

export async function MoveNoteHandler(req: Request, res: Response, next: NextFunction) {
    if (req.body.beforeId && req.body.afterId) {
        const afterId: Types.ObjectId = new Types.ObjectId(req.body.afterId as string)
        const beforeId: Types.ObjectId = new Types.ObjectId(req.body.beforeId as string)

        const note: Note | null =
            await MoveNoteBetween(req.note.uid, req.note._id, beforeId, afterId);

        res.status(200).send({ message: "Note moved!", note: note });
        return
    }

    const note: Note | null = await MoveNoteToLast(req.note.uid, req.note._id);
    res.status(200).send({ message: "Note moved!", note: note });
}

export async function CreateNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.body.beforeId && req.body.afterId) {
            const afterId: Types.ObjectId = new Types.ObjectId(req.body.afterId as string)
            const beforeId: Types.ObjectId = new Types.ObjectId(req.body.beforeId as string)

            const note: Note | null =
                await InsertNoteBetweenNotes(req.note, beforeId, afterId);

            res.status(200).send({ message: "Note created!", note: note });
        }

        const note: Note | null = await AppendNote(req.note);

        res.status(200).send({ message: "Note created!", note: note });
    } catch (error) {
        next(error)
    }
}

export async function GetAllNotesHandler(req: Request, res: Response, next: NextFunction) {
    try {
        let notes: Note[] = await GetUsersNotes(req.user._id);
        res.status(200).send({ notes });
    } catch (error) {
        next(error)
    }
}

export async function GetNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id);
        if (!Types.ObjectId.isValid(id) || !req.params.id) {
            throw new AppError("Could not find note with provided id!", 404)
        }

        let note: Note | null = await GetNote(req.user._id, id);
        if (!note) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
        res.status(200).json({ note: note });
    } catch (error) {
        next(error)
    }
}

export async function UpdateNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const note: INote | null = await UpdateNote(req.note);
        if (note === null) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
        res.status(200).json({ message: "Note updated!", note: note });
    } catch (error) {
        next(error)
    }
}

export async function DeleteNoteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id);
        if (!Types.ObjectId.isValid(id) || !req.params.id) {
            throw new AppError("Could not find note with provided id!", 404)
        }

        const note: Note | null = await DeleteNote(req.user._id, id);
        if (!note) {
            res.status(404).json({ message: "Note not found!" })
            return;
        }
        res.status(200).json({ message: "Note deleted!", note: note });
    } catch (error) {
        next(error)
    }
}

// ---- Controller Methods ----

async function GetPostionBetweenNote(uid: Types.ObjectId, noteAId: Types.ObjectId, noteBId: Types.ObjectId): Promise<number> {
    const noteA: INote | null = await NoteModel.findOne({ _id: noteAId, uid: uid })
    const noteB: INote | null = await NoteModel.findOne({ _id: noteBId, uid: uid })
    if (!noteA || !noteB) {
        return await GetLastNotePostition(uid);
    }
    const newPosition = (noteA.position + noteB.position) / 2
    return newPosition;
}

async function GetLastNotePostition(uid: Types.ObjectId): Promise<number> {
    const lastNote: INote[] = await NoteModel.find({ uid }).sort({ position: -1 }).limit(1)
    let newPosition = 100;
    if (lastNote.length > 0) {
        newPosition += lastNote[0].position;
    }
    return newPosition
}

export async function InsertNoteBetweenNotes(note: Note, noteAId: Types.ObjectId, noteBId: Types.ObjectId): Promise<Note | null> {
    note.position = await GetPostionBetweenNote(noteAId, noteBId, note.uid);
    return await CreateNote(note);
}

export async function AppendNote(note: Note): Promise<Note | null> {
    note.position = await GetLastNotePostition(note.uid);
    return await CreateNote(note);
}

export async function MoveNoteBetween(uid: Types.ObjectId, noteId: Types.ObjectId, noteAId: Types.ObjectId, noteBId: Types.ObjectId): Promise<Note | null> {
    const note: Note | null = await GetNote(uid, noteId);
    if (!note) return null;

    note.position = await GetPostionBetweenNote(uid, noteAId, noteBId);

    const updatedNote: Note | null = await UpdateNote(note);
    return updatedNote;
}

export async function MoveNoteToLast(uid: Types.ObjectId, noteId: Types.ObjectId) {
    const note: Note | null = await GetNote(uid, noteId);
    if (!note) return null;

    note.position = await GetLastNotePostition(uid);

    const updatedNote: Note | null = await UpdateNote(note);
    return updatedNote;
}

export async function CreateNote(note: Note): Promise<Note | null> {
    // Generate new object id
    note = { ...note, _id: new Types.ObjectId() }

    const newNote: Note | null = await NoteModel.create(note)
        .then(data => data.toObject({ versionKey: false }));
    return newNote;
}

export async function GetAllNotes(): Promise<INote[]> {
    const notes: INote[] = await NoteModel.find({})
        .then(data => data.map(note => note.toObject({ versionKey: false })));
    return notes;
}

export async function GetUsersNotes(uid: Types.ObjectId): Promise<Note[]> {
    const notes: Note[] = await NoteModel.find({ uid }).sort({ position: 1 })
        .then(data => data.map(note => note.toObject({ versionKey: false })));
    return notes;
}

export async function GetNote(uid: Types.ObjectId, noteId: Types.ObjectId): Promise<Note | null> {
    const note: Note | null = await NoteModel.findOne({ _id: noteId, uid: uid })
        .then(data => data?.toObject({ versionKey: false }) ?? null)
    return note;
};

export async function UpdateNote(note: Note): Promise<Note | null> {
    const updatedNote: Note | null = await NoteModel.findOneAndUpdate({ _id: note._id, uid: note.uid }, note, { new: true })
        .then(data => data?.toObject({ versionKey: false }) ?? null);
    return updatedNote;
}

export async function DeleteNote(uid: Types.ObjectId, noteId: Types.ObjectId): Promise<Note | null> {
    const note: Note | null = await NoteModel.findOneAndDelete({ _id: noteId, uid: uid })
        .then(data => data?.toObject({ versionKey: false }) ?? null);
    return note;
}

export async function GetNotesInNote(uid: Types.ObjectId, noteId: Types.ObjectId): Promise<Note[]> {
    const notes: Note[] = await NoteModel.find({ uid, noteId }).sort({ position: 1 })
        .then(data => data.map(note => note.toObject({ versionKey: false })));
    return notes;
}
