import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../service";

const API = `${baseURL}/categories`;

export const fetchCategories = createAsyncThunk("categories/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(API);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to fetch categories");
    }
});

export const addCategory = createAsyncThunk("categories/add", async (payload, { rejectWithValue }) => {
    try {
        const res = await axios.post(API, payload);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to add category");
    }
});

export const deleteCategory = createAsyncThunk("categories/delete", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || "Failed to delete category");
    }
});

const categorySlice = createSlice({
    name: "categories",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data || [];
            })
            .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(addCategory.fulfilled, (state, action) => {
                if (action.payload?.data) state.data.push(action.payload.data);
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.data = state.data.filter(c => c.id !== action.payload);
            });
    }
});

export default categorySlice.reducer;
