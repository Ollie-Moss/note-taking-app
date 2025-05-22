import { createSelector } from "@reduxjs/toolkit"
import { ungroupedNotesArraySelector } from "./noteSelectors"
import { rootGroupArraySelector } from "./groupSelectors"

// Returns a list of all groups and notes with no parent
// Each item has a type attribute of either "group" or "note"
export const rootItemsArraySelector = createSelector(
    [rootGroupArraySelector, ungroupedNotesArraySelector], (groups, notes) => {
        return [...(groups.map(group => ({ ...group, type: "group" }))),
        ...notes.map(note => ({ ...note, type: "note" }))]
            .sort((a, b) => a.position - b.position)
    }
)
