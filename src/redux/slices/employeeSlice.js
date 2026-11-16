import { createSlice } from "@reduxjs/toolkit";
import {
  createEmployee,
  fetchEmployees,
  updateEmployeeTrainer,
} from "../actions/employeeActions";

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    records: [],
    pagination: null,
    loading: false,
    currentRequestId: null,
    creating: false,
    trainerUpdating: {},
    error: null,
    success: null,
  },
  reducers: {
    clearEmployeeError: (state) => {
      state.error = null;
    },
    clearEmployeeSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        const payload = action.payload;
        const rows = Array.isArray(payload?.data)
          ? payload.data
          : payload?.data?.data || payload?.employees || [];

        state.loading = false;
        state.records = rows;
        state.pagination =
          payload?.meta ||
          payload?.pagination ||
          payload?.data?.meta ||
          payload?.data?.pagination ||
          null;
        state.currentRequestId = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.error = action.payload || "Failed to fetch employees.";
        state.currentRequestId = null;
      })
      .addCase(updateEmployeeTrainer.pending, (state, action) => {
        state.trainerUpdating[action.meta.arg.employeeId] = true;
      })
      .addCase(updateEmployeeTrainer.fulfilled, (state, action) => {
        const { employeeId, isTrainer } = action.meta.arg;
        delete state.trainerUpdating[employeeId];
        const employee = state.records.find(
          (record) => String(record.id) === String(employeeId)
        );
        if (employee) employee.is_trainer = isTrainer;
      })
      .addCase(updateEmployeeTrainer.rejected, (state, action) => {
        delete state.trainerUpdating[action.meta.arg.employeeId];
      })
      .addCase(createEmployee.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.creating = false;
        state.success =
          action.payload?.message || "Employee created successfully.";
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "Failed to create employee.";
      });
  },
});

export const { clearEmployeeError, clearEmployeeSuccess } =
  employeeSlice.actions;

export default employeeSlice.reducer;
