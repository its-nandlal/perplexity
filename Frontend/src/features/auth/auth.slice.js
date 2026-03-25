import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        error: null,
        message: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setMessage: (state, action) => {
            state.message = action.payload
        }
    }
});

export const { setUser, setLoading, setError, setMessage } = authSlice.actions;
export default authSlice.reducer;