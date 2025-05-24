import axios from "axios"
import { Note } from "../models/note";
import { BASE_URL, TEST_UID } from "../lib/apiConfig";

// Provides Wrappers for http requests to note endpoints
// Provides typed return values
// Catches any request errors

// GET 'api/note'
// Returns all a users notes
export async function GetNotes(uid: string = TEST_UID): Promise<(Note)[]> {
    try {
        const res = await axios.get(`${BASE_URL}/note?preview=true`,
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                }
            });
        const notes: Note[] = res.data.notes;

        return notes;

    } catch (error: unknown) {
        throw error;
    }
}

// GET 'api/note/:id'
// Returns a specific note
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
        return note
    } catch (error: unknown) {
        throw error;
    }
}

// PATCH 'api/note/move?noteId&targetId&position'
// Moves a note based on the target and position
export async function MoveNote(id: string, targetId: string, position: 'before' | 'after', uid: string = TEST_UID): Promise<Note> {
    try {
        const updatedNote = await axios.patch(`${BASE_URL}/note/move?noteId=${id}&targetId=${targetId}&position=${position}`,{},
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                },
            })
            .then(res => {
                return res.data.note as Note;
            })
        return updatedNote
    } catch (error: unknown) {
        throw error
    }
}

// PATCH 'api/note'
// Updates a note
export async function UpdateNote(id: string, note: Partial<Note>, uid: string = TEST_UID): Promise<Note> {
    try {
        const updatedNote = await axios.patch(`${BASE_URL}/note`, { note: { _id: id, ...note } },
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                },
            })
            .then(res => {
                return res.data.note as Note;
            })
        return updatedNote
    } catch (error: unknown) {
        throw error
    }
}

// POST 'api/note'
// Creates a note 
export async function CreateNote(note: Note, uid: string = TEST_UID): Promise<Note | null> {
    try {
        const res = await axios.post(`${BASE_URL}/note`, { note: { ...note, uid: uid } },
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                },
            });
        const newNote = res.data.note as Note;
        return newNote
    } catch (error: unknown) {
        throw error
    }
}


// DELETE 'api/group/:id'
// Deletes a group
export async function DeleteNote(noteId: string, uid: string = TEST_UID): Promise<Note | null> {
    try {
        const res = await axios.delete(`${BASE_URL}/note/${noteId}`,
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                },
            });
        const note = res.data.note as Note;
        return note;
    } catch (error: unknown) {
        throw error
    }
}
