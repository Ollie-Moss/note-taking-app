import { createSelector } from "@reduxjs/toolkit";
import { Notes } from "../slices/noteSlice";
import { RootState } from "../store";
// All selectors convert the edited at property to a Date object,
// as it is stored as a string in redux (Date objs cant be serialized)

// Converts note map to a flat array sorted by position
export const noteArraySelector = createSelector((state: RootState) => state.notes, notes => {
    const notesWithDate: Notes = {}
    for (const [key, value] of Object.entries(notes)) {
        notesWithDate[key] = { ...value, editedAt: new Date(value.editedAt) };
    }
    return Object.values(notesWithDate).sort((a, b) => a.position - b.position)
});

// Converts notes map to a flat array sorted by position
// And only returns notes without parents
export const ungroupedNotesArraySelector = createSelector((state: RootState) => state.notes, notes => {
    const notesWithDate: Notes = {}
    for (const [key, value] of Object.entries(notes)) {
        notesWithDate[key] = { ...value, editedAt: new Date(value.editedAt) };
    }
    return Object.values(notesWithDate).filter(note => !note.parentId).sort((a, b) => a.position - b.position)
});

// Returns notes as map (how state is stored)
export const noteMapSelector = createSelector((state: RootState) => state.notes, notes => {
    const notesWithDate: Notes = {}
    for (const [key, value] of Object.entries(notes)) {
        notesWithDate[key] = { ...value, editedAt: new Date(value.editedAt) };
    }
    return notesWithDate
});
