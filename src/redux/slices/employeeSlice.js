import { createSlice } from "@reduxjs/toolkit";
import {
  archiveEmployee,
  createEmployee,
  fetchEmployeeById,
  fetchEmployees,
  fetchNextEmployeeCode,
  unarchiveEmployee,
  updateEmployeeStatus,
  updateEmployeeTrainer,
} from "../actions/employeeActions";

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    records: [],
    pagination: null,
    loading: false,
    currentRequestId: null,
    employeeDetail: null,
    employeeDetailLoading: false,
    employeeDetailError: null,
    currentEmployeeDetailRequestId: null,
    creating: false,
    nextEmployeeCodeLoading: false,
    nextEmployeeCodeError: null,
    trainerUpdating: {},
    statusUpdating: {},
    archiving: {},
    unarchiving: {},
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
    clearNextEmployeeCodeError: (state) => {
      state.nextEmployeeCodeError = null;
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
      .addCase(fetchEmployeeById.pending, (state, action) => {
        state.employeeDetail = null;
        state.employeeDetailLoading = true;
        state.employeeDetailError = null;
        state.currentEmployeeDetailRequestId = action.meta.requestId;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        if (
          state.currentEmployeeDetailRequestId !== action.meta.requestId
        ) {
          return;
        }

        state.employeeDetail = action.payload;
        state.employeeDetailLoading = false;
        state.currentEmployeeDetailRequestId = null;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        if (
          state.currentEmployeeDetailRequestId !== action.meta.requestId
        ) {
          return;
        }

        state.employeeDetailLoading = false;
        state.employeeDetailError =
          action.payload || "Failed to fetch employee details.";
        state.currentEmployeeDetailRequestId = null;
      })
      .addCase(fetchNextEmployeeCode.pending, (state) => {
        state.nextEmployeeCodeLoading = true;
        state.nextEmployeeCodeError = null;
      })
      .addCase(fetchNextEmployeeCode.fulfilled, (state) => {
        state.nextEmployeeCodeLoading = false;
        state.nextEmployeeCodeError = null;
      })
      .addCase(fetchNextEmployeeCode.rejected, (state, action) => {
        state.nextEmployeeCodeLoading = false;
        state.nextEmployeeCodeError =
          action.payload || "Failed to get the next employee code.";
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
      .addCase(updateEmployeeStatus.pending, (state, action) => {
        state.statusUpdating[action.meta.arg.employeeId] = true;
      })
      .addCase(updateEmployeeStatus.fulfilled, (state, action) => {
        const { employeeId, status } = action.meta.arg;
        delete state.statusUpdating[employeeId];
        const employee = state.records.find(
          (record) => String(record.id) === String(employeeId)
        );
        if (employee) employee.status = status;
      })
      .addCase(updateEmployeeStatus.rejected, (state, action) => {
        delete state.statusUpdating[action.meta.arg.employeeId];
      })
      .addCase(archiveEmployee.pending, (state, action) => {
        state.archiving[action.meta.arg.employeeId] = true;
      })
      .addCase(archiveEmployee.fulfilled, (state, action) => {
        const { employeeId } = action.meta.arg;
        delete state.archiving[employeeId];
        state.records = state.records.filter(
          (record) => String(record.id) !== String(employeeId)
        );
      })
      .addCase(archiveEmployee.rejected, (state, action) => {
        delete state.archiving[action.meta.arg.employeeId];
      })
      .addCase(unarchiveEmployee.pending, (state, action) => {
        state.unarchiving[action.meta.arg.employeeId] = true;
      })
      .addCase(unarchiveEmployee.fulfilled, (state, action) => {
        const { employeeId } = action.meta.arg;
        delete state.unarchiving[employeeId];
        state.records = state.records.filter(
          (record) => String(record.id) !== String(employeeId)
        );
      })
      .addCase(unarchiveEmployee.rejected, (state, action) => {
        delete state.unarchiving[action.meta.arg.employeeId];
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

export const {
  clearEmployeeError,
  clearEmployeeSuccess,
  clearNextEmployeeCodeError,
} = employeeSlice.actions;

export default employeeSlice.reducer;
