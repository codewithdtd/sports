import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        login: {
            user: null,
            isFetching: false,
            error: false
        },
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
        updateSuccess: (state, action) => {
            state.login.user = {};
            state.login.user.user = action.payload;
            state.login.user.accessToken = action.payload.accessToken;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logoutStart: (state) => {
            state.login.isFetching = true;
        },
        logoutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.user = null;
            state.login.error = false;
        },
        logoutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
    }
});

export const {
    loginStart, loginFailed, loginSuccess, 
    logoutStart, logoutFailed, logoutSuccess,
    updateSuccess,
} = userSlice.actions;

export default userSlice.reducer;