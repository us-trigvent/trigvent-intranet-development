import { createSlice } from "@reduxjs/toolkit";
import { createEmployee } from "../actions/employeeActions";

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    creating: false,
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
