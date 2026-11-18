import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const readPagination = (payload, params, count) => {
  const source =
    payload?.pagination ||
    payload?.meta ||
    payload?.data?.pagination ||
    payload?.data?.meta ||
    {};

  return {
    page: Number(source.current_page || source.page || params.page || 1),
    perPage: Number(
      source.per_page || source.perPage || params.per_page || 25
    ),
    total: Number(
      source.total || source.total_rec || source.total_records || count
    ),
  };
};

export const fetchActivityLogs = createAsyncThunk(
  "activityLogs/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/activity-logs", { params });
      const payload = response.data;

      if (payload?.success === false) {
        return rejectWithValue(
          payload.message || "Failed to fetch activity logs."
        );
      }

      const records = [
        payload?.data?.data,
        payload?.data?.logs,
        payload?.data?.activity_logs,
        payload?.data,
        payload?.logs,
        payload?.activity_logs,
      ].find(Array.isArray);

      if (!records) {
        return rejectWithValue(
          "The activity log API returned an invalid response."
        );
      }

      return {
        records,
        pagination: readPagination(payload, params, records.length),
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch activity logs."
      );
    }
  }
);
