import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Converts groups map to a flat array sorted by position
export const groupArraySelector = createSelector((state: RootState) => state.groups, groups => {
    return Object.values(groups)
        .sort((a, b) => a.position - b.position)
});

// Converts groups map to a flat array sorted by position
// And only returns groups without parents
export const rootGroupArraySelector = createSelector((state: RootState) => state.groups, groups => {
    return Object.values(groups).filter(group => !group.parentId)
        .sort((a, b) => a.position - b.position)
});

// Returns groups as map (how state is stored)
export const groupMapSelector = (state: RootState) => state.groups
