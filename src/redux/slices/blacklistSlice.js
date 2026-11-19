
import { createSlice } from "@reduxjs/toolkit";

import {
  createBlacklistEntry,
  fetchBlacklistEmployees,
  deleteBlacklistEntry,
  fetchBlacklistEntry,
  updateBlacklistEntry,
} from "../actions/blacklistActions";

const initialState = {
  records: [],
  pagination: { page: 1, perPage: 25, total: 0 },
  loading: false,
  fetchRequestId: null,
  error: null,

  creating: false,
  updating: false,
  fetchingSingle: false,
  deleting: false,
  deleteError: null,
};

const blacklistSlice = createSlice({
  name: "blacklist",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch blacklist records
      .addCase(fetchBlacklistEmployees.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.fetchRequestId = action.meta.requestId;
      })

      .addCase(fetchBlacklistEmployees.fulfilled, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.records = action.payload.records;
        state.pagination = action.payload.pagination;
        state.fetchRequestId = null;
      })

      .addCase(fetchBlacklistEmployees.rejected, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.error =
          action.payload || "Failed to load blacklist records.";
        state.fetchRequestId = null;
      })
      // Fetch single blacklist entry
      .addCase(fetchBlacklistEntry.pending, (state) => {
        state.fetchingSingle = true;
        state.error = null;
      })

      .addCase(fetchBlacklistEntry.fulfilled, (state) => {
        state.fetchingSingle = false;
      })

      .addCase(fetchBlacklistEntry.rejected, (state, action) => {
        state.fetchingSingle = false;
        state.error =
          action.payload || "Failed to fetch blacklist entry.";
      })

      // Update blacklist entry
      .addCase(updateBlacklistEntry.pending, (state) => {
        state.updating = true;
        state.error = null;
      })

      .addCase(updateBlacklistEntry.fulfilled, (state) => {
        state.updating = false;
      })

      .addCase(updateBlacklistEntry.rejected, (state, action) => {
        state.updating = false;
        state.error =
          action.payload || "Failed to update blacklist entry.";
      })
      // Create blacklist entry
      .addCase(createBlacklistEntry.pending, (state) => {
        state.creating = true;
        state.error = null;
      })

      .addCase(createBlacklistEntry.fulfilled, (state) => {
        state.creating = false;
      })

      .addCase(createBlacklistEntry.rejected, (state, action) => {
        state.creating = false;
        state.error =
          action.payload || "Failed to create blacklist entry.";
      })

      // Delete blacklist entry
      .addCase(deleteBlacklistEntry.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })

      .addCase(deleteBlacklistEntry.fulfilled, (state) => {
        state.deleting = false;
      })

      .addCase(deleteBlacklistEntry.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError =
          action.payload || "Failed to delete blacklist entry.";
      });
  },
});

export default blacklistSlice.reducer;
