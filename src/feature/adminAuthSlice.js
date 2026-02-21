import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: JSON.parse(localStorage.getItem("admin")) || null,
    isLoggedIn: !!localStorage.getItem("admin"),
    loading: false,
    error: null,
};

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.admin = action.payload;
            state.isLoggedIn = true;
            localStorage.setItem("admin", JSON.stringify(action.payload));
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.admin = null;
            state.isLoggedIn = false;
            localStorage.removeItem("admin");
        },
    },
});

export const adminAuthActions = adminAuthSlice.actions;
export const adminAuthReducer = adminAuthSlice.reducer;
