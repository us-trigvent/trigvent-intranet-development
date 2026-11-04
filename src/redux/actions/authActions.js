
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password, remember = true }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/auth/login",
        { email, password }
      );

      const { success, message, data } = response.data;

      if (!success || !data?.token || !data?.user) {
        return rejectWithValue(message || "Invalid login response.");
      }

      const session = {
        token: data.token,
        tokenType: data.token_type || "Bearer",
        user: data.user,
      };
      const storage = remember ? localStorage : sessionStorage;

      localStorage.removeItem("authSession");
      sessionStorage.removeItem("authSession");
      storage.setItem("authSession", JSON.stringify(session));

      return session;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again."
      );
    }
  }
);
