import axios from "axios"
import { Note } from "../models/note";

export async function GetNotes(uid: string = "680ee4867874d6af0995d534"): Promise<Note[]> {
    const res = await axios.get(`http://localhost:5000/api/note/`,
        {
            headers: {
                Authorization: `Bearer ${uid}`
            }
        });
    return res.data.notes as Note[];
}

export async function GetNote(noteId: string, uid: string = "680ee4867874d6af0995d534"): Promise<Note> {
    const res = await axios.get(`http://localhost:5000/api/note/${noteId}`,
        {
            headers: {
                Authorization: `Bearer ${uid}`
            }
        });
    return res.data.note as Note;
}
