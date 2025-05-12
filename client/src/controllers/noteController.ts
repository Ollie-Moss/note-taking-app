import axios, { AxiosError } from "axios"
import { Note, NotePreview } from "../models/note";
import { BASE_URL, TEST_UID } from "../lib/apiConfig";

export async function GetNotes(uid: string = TEST_UID): Promise<(Note | NotePreview)[]> {
    try {
        const res = await axios.get(`${BASE_URL}/note?preview=true`,
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                }
            });
        const notes: Note[] = res.data.notes;

        return notes.map((note: Note) => {
            return {
                ...note,
                editedAt: new Date(note.editedAt)
            }
        })

    } catch (error: unknown) {
        throw error;
    }
}

export async function GetNote(noteId: string, uid: string = TEST_UID): Promise<Note | null> {
    try {
        const note: Note | null = await axios.get(`${BASE_URL}/note/${noteId}`,
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                }
            })
            .then(res => {
                return res.data.note as Note;
            })
        return { ...note, editedAt: new Date(note.editedAt) };
    } catch (error: unknown) {
        throw error;
    }
}

export async function UpdateNote(note: Note, uid: string = TEST_UID): Promise<Note> {
    try {
        const updatedNote = await axios.patch(`${BASE_URL}/note`, { note },
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                },
            })
            .then(res => {
                return res.data.note as Note;
            })
        return { ...updatedNote, editedAt: new Date(updatedNote.editedAt) };
    } catch (error: unknown) {
        throw error
    }
}

export async function CreateNote(note: Note, uid: string = TEST_UID): Promise<Note | null> {
    try {
        const res = await axios.post(`${BASE_URL}/note`, { note: { ...note, uid: uid } },
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                },
            });
        const newNote = res.data.note as Note;
        return { ...newNote, editedAt: new Date(newNote.editedAt) };
    } catch (error: unknown) {
        throw error
    }
}


export async function DeleteNote(noteId: string, uid: string = TEST_UID): Promise<Note | null> {
    try {
        const res = await axios.delete(`${BASE_URL}/note/${noteId}`,
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                },
            });
        const note = res.data.note as Note;
        return { ...note, editedAt: new Date(note.editedAt) };
    } catch (error: unknown) {
        throw error
    }
}
