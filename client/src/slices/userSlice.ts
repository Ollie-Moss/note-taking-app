import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetUser, LoginWithEmailAndPassword, SignUp } from "../controllers/authController";
import { User } from "../models/user";
import { getCookie } from "../lib/cookies";
import { RootState } from "../store";

export interface UserState {
    user?: User | null,
    status?: 'logged in' | 'logged out' | 'loading' | 'error',
    token?: string
}

const initialState: UserState = { token: getCookie('token') };

export const fetchUserAction = createAsyncThunk("user/get", async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    return await GetUser(token);
})

export const loginAction = createAsyncThunk("user/login", async ({ email, password }: { email: string, password: string }) => {
    return await LoginWithEmailAndPassword(email, password);
})
export const signupAction = createAsyncThunk("user/signup", async ({ name, email, password }: { name: string, email: string, password }) => {
    return await SignUp(name, email, password);
})

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            const token = action.payload;
            state.token = token;
        },
        logout(state) {
            state.status = 'logged out'
            state.token = ''
            state.user = null;
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchUserAction.pending, (state, action) => {
            state.status = 'loading'
        })
        builder.addCase(fetchUserAction.fulfilled, (state, action) => {
            state.status = 'logged in'
            state.user = action.payload;
        })
        builder.addCase(fetchUserAction.rejected, (state, action) => {
            state.status = 'logged out'
            state.user = null;
        })

        builder.addCase(loginAction.pending, (state, action) => {
            state.status = "loading"
        })
        builder.addCase(loginAction.rejected, (state, action) => {
            state.status = 'logged out'
            state.user = null;
        })

        builder.addCase(loginAction.fulfilled, (state, action) => {
            state.status = 'logged in'
            state.user = action.payload.user
            state.token = action.payload.token
        })

        builder.addCase(signupAction.pending, (state, action) => {
            state.status = "loading"
        })

        builder.addCase(signupAction.rejected, (state, action) => {
            state.status = 'logged out'
            state.user = null;
        })

        builder.addCase(signupAction.fulfilled, (state, action) => {
            state.status = 'logged in'
            state.user = action.payload.user
            state.token = action.payload.token
        })
    }
})

export const { setToken, logout } = userSlice.actions
export default userSlice.reducer;
