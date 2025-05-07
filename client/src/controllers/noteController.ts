import axios, { AxiosError } from "axios"
import { Note } from "../models/note";
import { BASE_URL, TEST_UID } from "../lib/apiConfig";

export async function GetNotes(uid: string = TEST_UID): Promise<Note[]> {
    try {
        const res = await axios.get(`${BASE_URL}/note`,
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                }
            });
        return res.data.notes as Note[];
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
        return note;
    } catch (error: unknown) {
        throw error;
    }
}

export async function UpdateNote(note: Note, uid: string = TEST_UID): Promise<Note> {
    try {
        const res = await axios.put(`${BASE_URL}/note`, { note },
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                },
            })
            .then(res => {
                return res.data.note as Note;
            })
        return res;
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
        return res.data.note as Note;
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
        return res.data.note as Note;
    } catch (error: unknown) {
        throw error
    }
}
