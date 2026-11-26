
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const createProject = createAsyncThunk(
  "projects/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/projects",
        payload
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Failed to create project."
        );
      }

      return response.data;
    } catch (error) {
      const responseData = error.response?.data;

      const validationMessage = responseData?.errors
        ? Object.values(responseData.errors).flat().join(" ")
        : "";

      return rejectWithValue(
        responseData?.message ||
          validationMessage ||
          error.message ||
          "Failed to create project."
      );
    }
  }
);
