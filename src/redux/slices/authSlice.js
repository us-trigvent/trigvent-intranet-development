
import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../actions/authActions";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Login Pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Login Success
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // Supports common response structures.
        // Confirm these paths against the actual API response.
        const data = action.payload?.data ?? action.payload;

        state.user = data?.user ?? null;

        state.token =
          data?.accessToken ??
          data?.token ??
          data?.access_token ??
          null;

        state.isAuthenticated = true;
      })

      // Login Failed
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something went wrong.";
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
