import { createAsyncThunk, createSlice, PayloadAction, } from "@reduxjs/toolkit";
import { Note, NewNote } from "../models/note";
import { CreateNote, DeleteNote, GetNote, GetNotes, UpdateNote } from "../controllers/noteController";

export type NoteAction<T = Note> = PayloadAction<{ note?: T, id?: string }>;

export interface Notes {
    [key: string]: Note | Partial<Note>
}

const initialState: Notes = {}

export const fetchNotesAsync = createAsyncThunk("notes/fetchAllAsync", async () => {
    return await GetNotes()
})
export const fetchNoteAsync = createAsyncThunk("notes/fetchAsync", async (id: string) => {
    return { note: await GetNote(id) }
})
export const createNoteAsync = createAsyncThunk("notes/createAsync", async () => {
    const note: Note = NewNote();
    return { note: await CreateNote(note) }
})
export const updateNoteAsync = createAsyncThunk("notes/updateAsync", async ({ id, note }: { id: string, note: Partial<Note> }) => {
    const newNote = await UpdateNote(id, note)
    return { id, note: newNote }
})
export const deleteNoteAsync = createAsyncThunk("notes/deleteAsync", async (id: string) => {
    return { id: await DeleteNote(id).then(note => note._id) }
})

export const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
        createNote: (state, action: NoteAction) => {
            state[action.payload.id] = action.payload.note
        },
        updateNote: (state, action: NoteAction<Partial<Note>>) => {
            const id = action.payload.id;
            state[id] = { ...state[id], ...action.payload.note }

        },
        deleteNote: (state, action: NoteAction) => {
            delete state[action.payload.id]
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchNotesAsync.fulfilled, (state, action: PayloadAction<Partial<Note>[]>) => {
            for (const note of action.payload) {
                state[note._id] = note;
            }
        })
        builder.addCase(fetchNoteAsync.fulfilled, (state, action: NoteAction) => {
            state[action.payload.id] = action.payload.note
        })
        builder.addCase(createNoteAsync.fulfilled, (state, action: NoteAction) => {
            state[action.payload.id] = action.payload.note
        })
        builder.addCase(updateNoteAsync.fulfilled, (state, action: NoteAction) => {
            const id = action.payload.id;
            state[id] = { ...state[id], ...action.payload.note }
        })
        builder.addCase(deleteNoteAsync.fulfilled, (state, action: NoteAction) => {
            delete state[action.payload.id]
        })

    },
});

export const { createNote, updateNote, deleteNote } = noteSlice.actions;
export default noteSlice.reducer;
