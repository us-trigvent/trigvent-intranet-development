
import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../actions/authActions";

const getStoredSession = () => {
  const storedSession =
    localStorage.getItem("authSession") ||
    sessionStorage.getItem("authSession");

  if (!storedSession) return null;

  try {
    const session = JSON.parse(storedSession);
    return session?.token ? session : null;
  } catch {
    localStorage.removeItem("authSession");
    sessionStorage.removeItem("authSession");
    return null;
  }
};

const storedSession = getStoredSession();

const initialState = {
  user: storedSession?.user || null,
  token: storedSession?.token || null,
  loading: false,
  error: null,
  isAuthenticated: Boolean(storedSession?.token),
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
      localStorage.removeItem("authSession");
      sessionStorage.removeItem("authSession");
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

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.token);
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
