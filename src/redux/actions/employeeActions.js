import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/employees", { params });
      const payload = response.data;
      const rows = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.data;

      if (payload?.success === false) {
        return rejectWithValue(payload.message || "Failed to fetch employees.");
      }

      if (!Array.isArray(rows)) {
        return rejectWithValue("The employee API returned an invalid response.");
      }

      return payload;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch employees."
      );
    }
  }
);

export const updateEmployeeTrainer = createAsyncThunk(
  "employees/updateTrainer",
  async ({ employeeId, isTrainer }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/employees/${employeeId}/trainer`,
        { is_trainer: isTrainer }
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Failed to update trainer status."
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update trainer status."
      );
    }
  }
);

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
