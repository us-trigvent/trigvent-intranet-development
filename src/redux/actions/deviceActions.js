import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchDevices = createAsyncThunk(
  "devices/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/devices", {
        params: {
          filter: 1,
          type: "available",
          page: 1,
          per_page: 25,
          ...params,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch devices."
      );
    }
  }
);

// Keep your existing createDevice action below.
export const createDevice = createAsyncThunk(
  "devices/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/devices",
        formData
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Failed to add device."
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
        "Failed to add device."
      );
    }
  }
);

export const deleteDevice = createAsyncThunk(
  "devices/delete",
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/devices/${deviceId}`
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Failed to archive device."
        );
      }

      return {
        deviceId,
        ...response.data,
      };
    } catch (error) {
      const responseData = error.response?.data;

      const validationMessage = responseData?.errors
        ? Object.values(responseData.errors).flat().join(" ")
        : "";

      return rejectWithValue(
        responseData?.message ||
        validationMessage ||
        error.message ||
        "Failed to archive device."
      );
    }
  }
);


export const fetchDeviceLogs = createAsyncThunk(
  "devices/fetchLogs",
  async ({ deviceId, page = 1, per_page = 25 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/devices/${deviceId}/logs`,
        {
          params: {
            page,
            per_page,
          },
        }
      );

      return {
        deviceId,
        response: response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch device logs."
      );
    }
  }
);
