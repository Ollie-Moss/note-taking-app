import { PayloadAction } from "@reduxjs/toolkit";
import { Note } from "../models/note";

export function noteReducer(state: { [key: string]: Note } = {}, action: PayloadAction<{ note?: Note, id?: string }>) {
    const newNotes = { ...state }
    const newNote = action.payload.note;
    const id = action.payload.id;
    switch (action.type) {
        case 'note/update':
            newNotes[id] = { ...newNotes[id], ...newNote }
            return newNotes;
        case 'note/add':
            newNotes[newNote._id] = newNote
            return newNotes
        case 'note/delete':
            delete newNotes[id]
            return newNotes
        default:
            return state;
    }
}
