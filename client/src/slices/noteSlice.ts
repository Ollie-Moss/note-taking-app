import { createAsyncThunk, createSelector, createSlice, PayloadAction, } from "@reduxjs/toolkit";
import { Note, NewNote } from "../models/note";
import { CreateNote, DeleteNote, GetNote, GetNotes, MoveNote, UpdateNote } from "../controllers/noteController";
import { RootState } from "../store";
import { deleteGroupAsync } from "./groupSlice";

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
export const fetchNotesAsync = createAsyncThunk("notes/fetchAllAsync", async () => {
    return await GetNotes()
})

// Fetch a single note by ID
export const fetchNoteAsync = createAsyncThunk("notes/fetchAsync", async (id: string) => {
    return { note: await GetNote(id) }
})

// Create a new note
export const createNoteAsync = createAsyncThunk("notes/createAsync", async () => {
    const note: Note = NewNote();
    return { note: await CreateNote(note) }
})

// Update an existing note
export const updateNoteAsync = createAsyncThunk("notes/updateAsync", async ({ id, note }: { id: string, note: Partial<Note> }) => {
    const newNote = await UpdateNote(id, note)
    return { id, note: newNote }
})

// Move a note 
export const moveNoteAsync = createAsyncThunk("notes/moveAsync", async ({ id, targetId, position, finalPosition }: { id: string, targetId: string, position: 'before' | 'after', finalPosition: number }) => {
    const newNote = await MoveNote(id, targetId, position)
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
export const deleteNoteAsync = createAsyncThunk("notes/deleteAsync", async (id: string) => {
    return { id: await DeleteNote(id).then(note => note._id) }
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
        builder.addCase(updateNoteAsync.pending, (state, action) => {
            const id = action.meta.arg.id;
            const updatedNote = { ...state[id], ...action.meta.arg.note }
            state[id] = updatedNote
        })

        // Optimistically move note
        builder.addCase(moveNoteAsync.pending, (state, action) => {
            state[action.meta.arg.id].position = action.meta.arg.finalPosition
        })

        // Optimistically remove a note
        builder.addCase(deleteNoteAsync.pending, (state, action) => {
            const id = action.meta.arg;
            delete state[id]
        })

        // Delete notes in a deleted group
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
