import { INote, NoteModel, Note } from "../models/noteModel";

export async function GetAllNotes(): Promise<INote[]> {
    const notes: INote[] = await NoteModel.find({}) as INote[];
    return notes;
}

export async function CreateNote(note: INote): Promise<INote> {
    const newNote: INote = await NoteModel.create(note);
    return newNote;
}

export async function DeleteNote(id: string): Promise<INote | null> {
    const note: INote | null = await NoteModel.findByIdAndDelete(id);
    return note;
}

export async function UpdateNote(note: Note): Promise<INote | null> {
    const updatedNote: INote | null = await NoteModel.findOneAndUpdate({ _id: note._id }, note);
    return updatedNote;
}

export async function GetNote(id: string): Promise<INote> {
    const note = await NoteModel.findById(id);
    return note as INote;
};
