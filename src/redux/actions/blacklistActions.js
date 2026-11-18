import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const employeeRows = (payload) => {
  const rows = [
    payload?.data?.data,
    payload?.data?.employees,
    payload?.data,
    payload?.employees,
  ].find(Array.isArray);

  if (!rows) {
    throw new Error("The employee lookup API returned an invalid response.");
  }

  return rows
    .map((employee) => ({
      ...employee,
      id: employee?.id ?? employee?.employee_id,
      name:
        employee?.name ??
        employee?.full_name ??
        employee?.employee_name ??
        [employee?.first_name, employee?.last_name].filter(Boolean).join(" "),
    }))
    .filter(
      (employee) =>
        employee.id !== undefined &&
        employee.id !== null &&
        String(employee.name || "").trim()
    )
    .map((employee) => ({
      ...employee,
      id: String(employee.id),
      name: String(employee.name).trim(),
    }));
};

export const fetchBlacklistEmployees = createAsyncThunk(
  "blacklist/fetchEmployees",
  async ({ search = "", page = 1, perPage = 100 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/lookups/employees", {
        params: {
          search,
          page,
          per_page: perPage,
        },
      });
      const payload = response.data;

      if (payload?.success === false) {
        return rejectWithValue(
          payload.message || "Failed to fetch employees."
        );
      }

      return employeeRows(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch employees."
      );
    }
  }
);

export const createBlacklistEntry = createAsyncThunk(
  "blacklist/createEntry",
  async (entry, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/blacklist", entry);
      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Failed to create blacklist entry."
        );
      }

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
          "Failed to create blacklist entry."
      );
    }
  }
);
