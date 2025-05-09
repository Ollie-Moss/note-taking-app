import { Note, NoteModel, INote, NotePreview } from "../models/noteModel";
import { Types } from "mongoose";

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

export async function GetNotesInGroup(uid: Types.ObjectId, groupId: Types.ObjectId): Promise<Note[]> {
    const notes: Note[] = await NoteModel.find({ uid, noteId: groupId }).sort({ position: 1 })
        .then(data => data.map(note => note.toObject({ versionKey: false })));
    return notes;
}

export async function GetNotesPreviewInGroup(uid: Types.ObjectId, groupId: Types.ObjectId): Promise<NotePreview[]> {
    const notes: NotePreview[] = await NoteModel.find({ uid, groupId }).select('_id title editedAt position favourite groupId').sort({ position: 1 })
        .then(data => data.map(note => note.toObject({ versionKey: false })));
    return notes;
}
