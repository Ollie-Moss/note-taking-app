import { createAsyncThunk, createSelector, createSlice, PayloadAction, } from "@reduxjs/toolkit";
import { Note, NewNote } from "../models/note";
import { CreateNote, DeleteNote, GetNote, GetNotes, MoveNote, UpdateNote } from "../controllers/noteController";
import { RootState } from "../store";
import { deleteGroupAsync } from "./groupSlice";
import { logout } from "./userSlice";

// Contains all logic pertaining to the notes state in redux
// Note: Replicates all business logic

// Note action type
export type NoteAction<T = Note> = PayloadAction<
    { note?: T, id?: string }>

// Note State type
export interface Notes {
    [key: string]: Note
}

const initialState: Notes = {}

// Fetch all notes
export const fetchNotesAsync = createAsyncThunk("notes/fetchAllAsync", async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    return await GetNotes(token)
})

// Fetch a single note by ID
export const fetchNoteAsync = createAsyncThunk("notes/fetchAsync", async (id: string, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    return { note: await GetNote(id, token) }
})

// Create a new note
export const createNoteAsync = createAsyncThunk("notes/createAsync", async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    const note: Note = NewNote();
    return { note: await CreateNote(note, token) }
})

// Update an existing note
export const updateNoteAsync = createAsyncThunk("notes/updateAsync", async ({ id, note }: { id: string, note: Partial<Note> }, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    const newNote = await UpdateNote(id, note, token)
    return { id, note: newNote }
})

// Move a note 
export const moveNoteAsync = createAsyncThunk("notes/moveAsync", async ({ id, targetId, position, finalPosition }: { id: string, targetId: string, position: 'before' | 'after', finalPosition: number }, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    const newNote = await MoveNote(id, targetId, position, token)
    return { id, note: newNote }
})

// Move and regroup a note if necessary
export const moveNoteAndMaybeRegroupAsync = createAsyncThunk("notes/moveAndRegroupAsync", async ({ id, targetId, position }: { id: string, targetId: string, position: 'before' | 'after' }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const notes = state.notes;
    const groups = state.groups;
    const current = notes[id];
    const target = notes[targetId] || groups[targetId]

    if (!current || !target) return;

    if (current.parentId !== target.parentId) {
        await dispatch(updateNoteAsync({ id, note: { parentId: target.parentId } }));
    }

    if (!target || !current) return;

    const allEntities = [...Object.values(groups), ...Object.values(notes)].filter(item => item.parentId == target.parentId).sort((a, b) => a.position - b.position)

    let finalPosition = current.position;

    if (position == "before") {
        const index = allEntities.findIndex(note => note._id == target._id)
        if (index == 0 || allEntities.length <= 1) {
            finalPosition = target.position / 2;
        } else {
            finalPosition = (allEntities[index - 1].position + target.position) / 2
        }
    }
    if (position == "after") {
        const index = allEntities.findIndex(note => note._id == target._id)
        if (index == allEntities.length - 1) {
            finalPosition = target.position + 100;
        } else {
            finalPosition = (allEntities[index + 1].position + target.position) / 2
        }
    }
    await dispatch(moveNoteAsync({ id, targetId, position, finalPosition }));
})

// Delete a note by ID
export const deleteNoteAsync = createAsyncThunk("notes/deleteAsync", async (id: string, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    return { id: await DeleteNote(id, token).then(note => note._id) }
})

export const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        // Add all fetched notes
        builder.addCase(fetchNotesAsync.fulfilled, (state, action: PayloadAction<Note[]>) => {
            for (const note of action.payload) {
                state[note._id] = note;
            }
        })

        // Update a single notes contents
        builder.addCase(fetchNoteAsync.fulfilled, (state, action: NoteAction) => {
            // only retrieve content as to not interupt any current requests
            state[action.payload.note._id] = {
                ...state[action.payload.note._id],
                contents: action.payload.note.contents
            }
        })

        // Create new note
        builder.addCase(createNoteAsync.fulfilled, (state, action: NoteAction) => {
            state[action.payload.note._id] = action.payload.note
        })

        // Optimistically update note 
        builder.addCase(updateNoteAsync.fulfilled, (state, action) => {
            const id = action.payload.id;
            const updatedNote = { ...state[id], ...action.payload.note }
            state[id] = updatedNote
        })

        builder.addCase(moveNoteAsync.fulfilled, (state, action) => {
            state[action.payload.id].position = action.payload.note.position;
        })

        builder.addCase(deleteNoteAsync.fulfilled, (state, action) => {
            const id = action.payload.id;
            if (state[id] != null) {
                delete state[id]
            }
        })


        // Delete notes in a deleted group
        builder.addCase(deleteGroupAsync.fulfilled, (state, action) => {
            const id = action.payload.id
            for (const note of Object.values(state)) {
                if (note.parentId == id) {
                    delete state[note._id];
                }
            }
        })

        builder.addCase(logout, (state, action) => {
            for (const key in state) {
                if (state.hasOwnProperty(key)) {
                    delete state[key];
                }
            }
        })
    },
});

export default noteSlice.reducer;
