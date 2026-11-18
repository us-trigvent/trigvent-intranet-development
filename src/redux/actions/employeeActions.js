import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/employees", { params });
      const payload = response.data;
      const rows = Array.isArray(payload?.data)
        ? payload.data
        : payload?.data?.data;

      if (payload?.success === false) {
        return rejectWithValue(payload.message || "Failed to fetch employees.");
      }

      if (!Array.isArray(rows)) {
        return rejectWithValue("The employee API returned an invalid response.");
      }

      return payload;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch employees."
      );
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  "employees/fetchById",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/employees/${employeeId}`);
      const payload = response.data;

      if (payload?.success === false) {
        return rejectWithValue(
          payload.message || "Failed to fetch employee details."
        );
      }

      const employee = [
        payload?.data?.employee,
        payload?.employee,
        payload?.data?.data,
        payload?.data,
      ].find(
        (candidate) =>
          candidate &&
          typeof candidate === "object" &&
          !Array.isArray(candidate)
      );

      if (!employee) {
        return rejectWithValue(
          "The employee API returned an invalid response."
        );
      }

      return employee;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          (error.response?.status === 404
            ? "Employee not found."
            : error.message) ||
          "Failed to fetch employee details."
      );
    }
  }
);

export const fetchNextEmployeeCode = createAsyncThunk(
  "employees/fetchNextCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/employees/next-code");
      const payload = response.data;

      if (payload?.success === false) {
        return rejectWithValue(
          payload.message || "Failed to get the next employee code."
        );
      }

      const containers = [
        payload,
        payload?.data,
        payload?.data?.data,
      ];
      const code = containers
        .flatMap((container) =>
          typeof container === "object" && container !== null
            ? [
                container.employee_code,
                container.next_employee_code,
                container.next_code,
                container.code,
              ]
            : [container]
        )
        .find(
          (value) =>
            (typeof value === "string" || typeof value === "number") &&
            String(value).trim()
        );

      if (code === undefined) {
        return rejectWithValue(
          "The employee code API returned an invalid response."
        );
      }

      return String(code).trim();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to get the next employee code."
      );
    }
  }
);

export const updateEmployeeTrainer = createAsyncThunk(
  "employees/updateTrainer",
  async ({ employeeId, isTrainer }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/employees/${employeeId}/trainer`,
        { is_trainer: isTrainer }
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Failed to update trainer status."
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update trainer status."
      );
    }
  }
);

export const updateEmployeeStatus = createAsyncThunk(
  "employees/updateStatus",
  async ({ employeeId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/employees/${employeeId}/status`,
        { status }
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Failed to update employee status."
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update employee status."
      );
    }
  }
);

export const archiveEmployee = createAsyncThunk(
  "employees/archive",
  async ({ employeeId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/employees/${employeeId}/archive`
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Failed to archive employee."
        );
      }

      return { employeeId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to archive employee."
      );
    }
  }
);

export const unarchiveEmployee = createAsyncThunk(
  "employees/unarchive",
  async ({ employeeId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/employees/${employeeId}/unarchive`
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Failed to unarchive employee."
        );
      }

      return { employeeId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to unarchive employee."
      );
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employees/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/employees", formData, {
        headers: {
          "Content-Type": false,
        },
      });

      return response.data;
    } catch (error) {
      const responseData = error.response?.data;
      const validationMessage = responseData?.errors
        ? Object.values(responseData.errors).flat().join(" ")
        : "";

      return rejectWithValue(
        responseData?.message ||
          validationMessage ||
          error.message ||
          "Failed to create employee."
      );
    }
  }
);
