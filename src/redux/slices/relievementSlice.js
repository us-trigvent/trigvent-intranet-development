import { createSlice } from "@reduxjs/toolkit";
import {
  createRelievement,
  fetchRelievementById,
  fetchRelievements,
  updateRelievement,
} from "../actions/relievementActions";

const relievementSlice = createSlice({
  name: "relievements",
  initialState: {
    records: [],
    pagination: null,
    loading: false,
    currentRequestId: null,
    error: null,
    detail: null,
    detailLoading: false,
    detailError: null,
    currentDetailRequestId: null,
    creating: false,
    updating: false,
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
      })
      .addCase(fetchRelievementById.pending, (state, action) => {
        state.detail = null;
        state.detailLoading = true;
        state.detailError = null;
        state.currentDetailRequestId = action.meta.requestId;
      })
      .addCase(fetchRelievementById.fulfilled, (state, action) => {
        if (state.currentDetailRequestId !== action.meta.requestId) return;
        state.detail = action.payload;
        state.detailLoading = false;
        state.currentDetailRequestId = null;
      })
      .addCase(fetchRelievementById.rejected, (state, action) => {
        if (state.currentDetailRequestId !== action.meta.requestId) return;
        state.detailLoading = false;
        state.detailError =
          action.payload || "Failed to fetch released employee details.";
        state.currentDetailRequestId = null;
      })
      .addCase(createRelievement.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createRelievement.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createRelievement.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "Failed to add the released employee.";
      })
      .addCase(updateRelievement.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateRelievement.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateRelievement.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to update the released employee.";
      });
  },
});

export default relievementSlice.reducer;
