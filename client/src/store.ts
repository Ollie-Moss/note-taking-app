import { configureStore } from '@reduxjs/toolkit'
import noteReducer from './slices/noteSlice'
import groupReducer from './slices/groupSlice'
import userReducer from './slices/userSlice'
import { setCookie } from './lib/cookies'

// reducers
const reducer = {
    groups: groupReducer,
    notes: noteReducer,
    user: userReducer
}

// setup redux store
export const store = configureStore({
    reducer,
})

// Updates 'token' cookie with state.user.token when store is updated
store.subscribe(() => {
    const token = store.getState().user.token;
    setCookie('token', token ?? '', 7);
})

// Docs: https://redux-toolkit.js.org/tutorials/typescript
// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
