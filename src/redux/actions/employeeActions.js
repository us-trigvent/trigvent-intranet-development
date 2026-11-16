import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const createEmployee = createAsyncThunk(
  "employees/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/employees", formData, {
        headers: {
          "Content-Type": false,
        },
      });

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
          "Failed to create employee."
      );
    }
  }
);
