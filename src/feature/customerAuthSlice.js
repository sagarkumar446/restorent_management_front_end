import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginCustomerApi, registerCustomerApi } from "../service/CustomerService";

export const registerCustomer = createAsyncThunk(
    "customerAuth/register",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await registerCustomerApi(payload);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Registration failed");
        }
    }
);

export const loginCustomer = createAsyncThunk(
    "customerAuth/login",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await loginCustomerApi(payload);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

export const logoutCustomer = createAsyncThunk(
    "customerAuth/logout",
    async (_, { rejectWithValue }) => {
        try {
            // Can optionally call a backend logout API here
            return true;
        } catch (err) {
            return rejectWithValue("Logout failed");
        }
    }
);

const initialState = {
    customer: JSON.parse(localStorage.getItem("customer")) || null,
    loading: false,
    error: null,
};

const customerAuthSlice = createSlice({
    name: "customerAuth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Registration
        builder.addCase(registerCustomer.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerCustomer.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(registerCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Login
        builder.addCase(loginCustomer.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginCustomer.fulfilled, (state, action) => {
            state.loading = false;
            // The backend returns a CustomAuthSession which contains customer profile
            state.customer = action.payload.data;
            localStorage.setItem("customer", JSON.stringify(action.payload.data));
        });
        builder.addCase(loginCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Logout
        builder.addCase(logoutCustomer.fulfilled, (state) => {
            state.customer = null;
            localStorage.removeItem("customer");
        });
    }
});

export const { clearError } = customerAuthSlice.actions;
export default customerAuthSlice.reducer;
