import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const getRows = (payload) =>
  [payload?.data?.data, payload?.data?.relievements, payload?.data, payload?.relievements]
    .find(Array.isArray);

export const fetchRelievements = createAsyncThunk(
  "relievements/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/relievements", { params });
      const payload = response.data;

      if (payload?.success === false) {
        return rejectWithValue(payload.message || "Failed to fetch released employees.");
      }

      const records = getRows(payload);
      if (!Array.isArray(records)) {
        return rejectWithValue("The released employees API returned an invalid response.");
      }

      return {
        records,
        pagination: payload?.meta || payload?.pagination || payload?.data?.meta || payload?.data?.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch released employees."
      );
    }
  }
);
