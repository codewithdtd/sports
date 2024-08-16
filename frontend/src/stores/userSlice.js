import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        login: {
            user: null,
            isFetching: false,
            error: false
        }
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.user = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
    }
});

export const {
    loginStart, loginFailed, loginSuccess
} = userSlice.actions;

export default userSlice.reducer;