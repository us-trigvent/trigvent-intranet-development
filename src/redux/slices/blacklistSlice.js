import { createSlice } from "@reduxjs/toolkit";
import {
  createBlacklistEntry,
  fetchBlacklistEmployees,
} from "../actions/blacklistActions";

const blacklistSlice = createSlice({
  name: "blacklist",
  initialState: {
    employees: [],
    employeesLoading: false,
    employeesRequestId: null,
    employeesError: null,
    creating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlacklistEmployees.pending, (state, action) => {
        state.employeesLoading = true;
        state.employeesError = null;
        state.employeesRequestId = action.meta.requestId;
      })
      .addCase(fetchBlacklistEmployees.fulfilled, (state, action) => {
        if (state.employeesRequestId !== action.meta.requestId) return;

        state.employees = action.payload;
        state.employeesLoading = false;
        state.employeesRequestId = null;
      })
      .addCase(fetchBlacklistEmployees.rejected, (state, action) => {
        if (state.employeesRequestId !== action.meta.requestId) return;

        state.employeesLoading = false;
        state.employeesError =
          action.payload || "Failed to fetch employees.";
        state.employeesRequestId = null;
      })
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
      });
  },
});

export default blacklistSlice.reducer;
