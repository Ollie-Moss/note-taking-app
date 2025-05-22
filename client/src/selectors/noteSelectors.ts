import { createSelector } from "@reduxjs/toolkit";
import { Notes } from "../slices/noteSlice";
import { RootState } from "../store";

export const noteArraySelector = createSelector((state: RootState) => state.notes, notes => {
    const notesWithDate: Notes = {}
    for (const [key, value] of Object.entries(notes)) {
        notesWithDate[key] = { ...value, editedAt: new Date(value.editedAt) };
    }
    return Object.values(notesWithDate).sort((a, b) => a.position - b.position)
});

export const ungroupedNotesArraySelector = createSelector((state: RootState) => state.notes, notes => {
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
