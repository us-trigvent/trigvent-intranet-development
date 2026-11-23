import { createSlice } from "@reduxjs/toolkit";
import { fetchRelievements } from "../actions/relievementActions";

const relievementSlice = createSlice({
  name: "relievements",
  initialState: {
    records: [],
    pagination: null,
    loading: false,
    currentRequestId: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelievements.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchRelievements.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.records = action.payload.records;
        state.pagination = action.payload.pagination;
        state.currentRequestId = null;
      })
      .addCase(fetchRelievements.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload || "Failed to fetch released employees.";
        state.currentRequestId = null;
      });
  },
});

export default relievementSlice.reducer;
