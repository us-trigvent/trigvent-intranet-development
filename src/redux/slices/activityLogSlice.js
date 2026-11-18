import { createSlice } from "@reduxjs/toolkit";
import { fetchActivityLogs } from "../actions/activityLogActions";

const initialState = {
  records: [],
  pagination: null,
  loading: false,
  currentRequestId: null,
  error: null,
};

const activityLogSlice = createSlice({
  name: "activityLogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.records = action.payload.records;
        state.pagination = action.payload.pagination;
        state.loading = false;
        state.currentRequestId = null;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.error = action.payload || "Failed to fetch activity logs.";
        state.currentRequestId = null;
      });
  },
});

export default activityLogSlice.reducer;
