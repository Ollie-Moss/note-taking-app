import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserState } from "../slices/userSlice";
import { User } from "../models/user";


// Current user state
export type UserSelectorState = {
    loading: boolean,
    error: boolean,
    user: User | null | undefined
}

// Creates userSelectorState based on user state in redux
export const userSelector = createSelector(
    (state: RootState) => state.user,
    (userState: UserState) => {
        // Create Selector state based on user state
        const result: UserSelectorState =
        {
            loading: userState.status == 'loading',
            error: userState.status == 'error',
            user: userState.user
        };
        return result as UserSelectorState;
    }
);
