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
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/blacklist", {
        params,
      });

      const payload = response.data;

      const records = (Array.isArray(payload?.data) ? payload.data : []).map(
        (item) => ({
          ...item,
          referenceId: item.reference_id ?? "—",
          employee: item.name ?? "—",
          department: item.department?.name ?? "—",
          designation: item.designation?.name ?? "—",
          date: item.date_formatted ?? item.date ?? "—",
        })
      );

      return {
        records,
        pagination: {
          page: Number(payload?.meta?.current_page ?? 1),
          perPage: Number(payload?.meta?.per_page ?? PER_PAGE),
          total: Number(payload?.meta?.total ?? 0),
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load blacklist records."
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

export const deleteBlacklistEntry = createAsyncThunk(
  "blacklist/deleteEntry",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/blacklist/${id}`);

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data.message || "Failed to delete blacklist entry."
        );
      }

      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete blacklist entry."
      );
    }
  }
);
export const fetchBlacklistEntry = createAsyncThunk(
  "blacklist/fetchBlacklistEntry",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/blacklist/${id}`);

      // Handle both { data: {...} } and directly returned objects.
      return response.data?.data?.data ??
        response.data?.data ??
        response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch blacklist entry."
      );
    }
  }
);

export const updateBlacklistEntry = createAsyncThunk(
  "blacklist/updateBlacklistEntry",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/blacklist/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update blacklist entry."
      );
    }
  }
);