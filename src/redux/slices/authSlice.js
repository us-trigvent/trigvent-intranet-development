
import { createSlice } from "@reduxjs/toolkit";
import { changePassword, loginUser, logoutUser } from "../actions/authActions";

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
  passwordLoading: false,
  passwordError: null,
  passwordSuccess: null,
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

    clearPasswordStatus: (state) => {
      state.passwordError = null;
      state.passwordSuccess = null;
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
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
        localStorage.removeItem("authSession");
        sessionStorage.removeItem("authSession");
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = action.payload || "Logout failed.";
        state.isAuthenticated = false;
        localStorage.removeItem("authSession");
        sessionStorage.removeItem("authSession");
      })

      .addCase(changePassword.pending, (state) => {
        state.passwordLoading = true;
        state.passwordError = null;
        state.passwordSuccess = null;
      })

      .addCase(changePassword.fulfilled, (state, action) => {
        state.passwordLoading = false;
        state.passwordError = null;
        state.passwordSuccess = action.payload;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.passwordError = action.payload || "Password change failed.";
        state.passwordSuccess = null;
      });
  },
});

export const { logout, clearError, clearPasswordStatus } = authSlice.actions;

export default authSlice.reducer;
