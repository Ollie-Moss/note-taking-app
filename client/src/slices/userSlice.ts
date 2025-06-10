import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetUser, LoginWithEmailAndPassword, SignUp } from "../controllers/authController";
import { User } from "../models/user";
import { getCookie } from "../lib/cookies";
import { RootState } from "../store";

// User state to be stored in redux
export interface UserState {
    user?: User | null,
    status?: 'logged in' | 'logged out' | 'loading' | 'error',
    token?: string
}

const initialState: UserState = { token: getCookie('token') };

// Gets a users data from the backend
export const fetchUserAction = createAsyncThunk("user/get", async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    return await GetUser(token);
})

// Logs a user in
export const loginAction = createAsyncThunk("user/login", async ({ email, password }: { email: string, password: string }) => {
    return await LoginWithEmailAndPassword(email, password);
})

// Signs a user up
export const signupAction = createAsyncThunk("user/signup", async ({ name, email, password }: { name: string, email: string, password: string }) => {
    return await SignUp(name, email, password);
})

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Sets the user.token state
        setToken(state, action: PayloadAction<string>) {
            const token = action.payload;
            state.token = token;
        },
        // Resets user state and clears token
        logout(state) {
            state.status = 'logged out'
            state.token = ''
            state.user = null;
        }
    },
    extraReducers(builder) {
        // Sets user status to loading
        builder.addCase(fetchUserAction.pending, (state, action) => {
            state.status = 'loading'
        })

        // Sets user status to logged in with user data
        builder.addCase(fetchUserAction.fulfilled, (state, action) => {
            state.status = 'logged in'
            state.user = action.payload;
        })

        // Sets user status to logged out and clears user data
        builder.addCase(fetchUserAction.rejected, (state, action) => {
            state.status = 'logged out'
            state.user = null;
        })

        // Sets user status to loading
        builder.addCase(loginAction.pending, (state, action) => {
            state.status = "loading"
        })

        // Sets user status to logged out and clears user data
        builder.addCase(loginAction.rejected, (state, action) => {
            state.status = 'logged out'
            state.user = null;
        })

        // Sets user status to logged in with user data and token
        builder.addCase(loginAction.fulfilled, (state, action) => {
            state.status = 'logged in'
            state.user = action.payload.user
            state.token = action.payload.token
        })

        // Sets user status to loading
        builder.addCase(signupAction.pending, (state, action) => {
            state.status = "loading"
        })

        // Sets user status to logged out and clears user data
        builder.addCase(signupAction.rejected, (state, action) => {
            state.status = 'logged out'
            state.user = null;
        })

        // Sets user status to logged in with user data and token
        builder.addCase(signupAction.fulfilled, (state, action) => {
            state.status = 'logged in'
            state.user = action.payload.user
            state.token = action.payload.token
        })
    }
})

export const { setToken, logout } = userSlice.actions
export default userSlice.reducer;
