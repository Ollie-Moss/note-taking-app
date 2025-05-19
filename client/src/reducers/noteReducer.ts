import { createSlice, PayloadAction, } from "@reduxjs/toolkit";
import { Note } from "../models/note";

export type NoteAction<T = Note> = PayloadAction<{ note?: T, id?: string }>;

export interface Notes {
    [key: string]: Note
}

const initialState: Notes = {}

export const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
        create: (state, action: NoteAction) => {
            state[action.payload.id] = action.payload.note
        },

        update: (state, action: NoteAction<Partial<Note>>) => {
            const id = action.payload.id;
            state[id] = { ...state[id], ...action.payload.note }

        },
        deleteNote: (state, action: NoteAction) => {
            delete state[action.payload.id]
        }
    }
});

export const { create, update, deleteNote } = noteSlice.actions;
export default noteSlice.reducer;
