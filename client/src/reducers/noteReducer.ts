import { createAsyncThunk, createSelector, createSlice, PayloadAction, } from "@reduxjs/toolkit";
import { Note, NewNote } from "../models/note";
import { CreateNote, DeleteNote, GetNote, GetNotes, MoveNote, UpdateNote } from "../controllers/noteController";
import { RootState } from "../store";
import { deleteGroupAsync } from "./groupReducer";
import { all } from "axios";

export type NoteAction<T = Note> = PayloadAction<
    { note?: T, id?: string }>

export interface Notes {
    [key: string]: Note
}

export const noteArraySelector = createSelector((state: RootState) => state.notes, notes => {
    const notesWithDate: Notes = {}
    for (const [key, value] of Object.entries(notes)) {
        notesWithDate[key] = { ...value, editedAt: new Date(value.editedAt) };
    }
    return Object.values(notesWithDate).sort((a, b) => a.position - b.position)
});

export const ungroupedNotesSelector = createSelector((state: RootState) => state.notes, notes => {
    const notesWithDate: Notes = {}
    for (const [key, value] of Object.entries(notes)) {
        notesWithDate[key] = { ...value, editedAt: new Date(value.editedAt) };
    }
    return Object.values(notesWithDate).filter(note => !note.parentId).sort((a, b) => a.position - b.position)
});

export const noteMapSelector = createSelector((state: RootState) => state.notes, notes => {
    const notesWithDate: Notes = {}
    for (const [key, value] of Object.entries(notes)) {
        notesWithDate[key] = { ...value, editedAt: new Date(value.editedAt) };
    }
    return notesWithDate
});

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
export const moveNoteAsync = createAsyncThunk("notes/moveAsync", async ({ id, targetId, position }: { id: string, targetId: string, position: 'before' | 'after' }) => {
    const newNote = await MoveNote(id, targetId, position)
    return { id, note: newNote }
})
export const deleteNoteAsync = createAsyncThunk("notes/deleteAsync", async (id: string) => {
    return { id: await DeleteNote(id).then(note => note._id) }
})

export const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        // Note Updates
        builder.addCase(fetchNotesAsync.fulfilled, (state, action: PayloadAction<Note[]>) => {
            for (const note of action.payload) {
                state[note._id] = note;
            }
        })
        builder.addCase(fetchNoteAsync.fulfilled, (state, action: NoteAction) => {
            state[action.payload.note._id] = action.payload.note
        })
        builder.addCase(createNoteAsync.fulfilled, (state, action: NoteAction) => {
            state[action.payload.note._id] = action.payload.note
        })
        builder.addCase(updateNoteAsync.pending, (state, action) => {
            const id = action.meta.arg.id;
            state[id] = { ...state[id], ...action.meta.arg.note }
        })
        builder.addCase(moveNoteAsync.pending, (state, action) => {
            const id = action.meta.arg.id;
            const targetId = action.meta.arg.targetId;
            const position = action.meta.arg.position;

            const targetEntity = state[targetId]
            const currentEntity = state[id]

            const allEntities = Object.values(state).filter(note => note.parentId == currentEntity.parentId).sort((a, b) => a.position - b.position)

            if (!targetEntity || !currentEntity) return;

            if (position == "before") {
                const index = allEntities.indexOf(targetEntity)
                if (index == 0) {
                    state[id].position = targetEntity.position / 2;
                    return
                }
                state[id].position = (allEntities[index - 1].position + targetEntity.position) / 2
                return
            }
            if (position == "after") {
                const index = allEntities.indexOf(targetEntity)
                if (index == allEntities.length - 1) {
                    state[id].position = targetEntity.position + 100;
                    return
                }
                state[id].position = (allEntities[index + 1].position + targetEntity.position) / 2
                return
            }
        })
        builder.addCase(deleteNoteAsync.pending, (state, action) => {
            const id = action.meta.arg;
            delete state[id]
        })


        // Group Updates
        builder.addCase(deleteGroupAsync.pending, (state, action) => {
            const id = action.meta.arg
            for (const note of Object.values(state)) {
                if (note.parentId == id) {
                    delete state[note._id];
                }
            }
        })
    },
});

export default noteSlice.reducer;
