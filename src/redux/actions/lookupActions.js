import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const lookupRows = (payload, collection) => {
  const singular = {
    states: "state",
    departments: "department",
    designations: "designation",
    cities: "city",
  }[collection];
  const rows = [
    payload?.data?.data,
    payload?.data?.[collection],
    payload?.data,
    payload?.[collection],
  ].find(Array.isArray);

  if (!rows) {
    throw new Error("The lookup API returned an invalid response.");
  }

  return rows
    .map((item) => ({
      id: item?.id ?? item?.value,
      name:
        item?.name ??
        item?.title ??
        item?.label ??
        item?.[`${singular}_name`] ??
        item?.[singular],
    }))
    .filter(
      (item) =>
        item.id !== undefined &&
        item.id !== null &&
        item.name !== undefined &&
        item.name !== null &&
        String(item.name).trim()
    )
    .map((item) => ({ id: String(item.id), name: String(item.name) }));
};

const fetchLookup = async (path, collection, params, rejectWithValue) => {
  try {
    const response = await axiosInstance.get(path, { params });
    const payload = response.data;

    if (payload?.success === false) {
      return rejectWithValue(payload.message || "Failed to fetch lookup data.");
    }

    return lookupRows(payload, collection);
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch lookup data."
    );
  }
};

export const fetchStates = createAsyncThunk(
  "lookups/fetchStates",
  async (_, { rejectWithValue }) =>
    fetchLookup("/lookups/states", "states", undefined, rejectWithValue)
);

export const fetchDepartments = createAsyncThunk(
  "lookups/fetchDepartments",
  async ({ search = "" } = {}, { rejectWithValue }) =>
    fetchLookup(
      "/lookups/departments",
      "departments",
      { search, page: 1, per_page: 100 },
      rejectWithValue
    )
);

export const fetchDesignations = createAsyncThunk(
  "lookups/fetchDesignations",
  async ({ departmentId, search = "" }, { rejectWithValue }) =>
    fetchLookup(
      "/lookups/designations",
      "designations",
      { search, page: 1, per_page: 100, department_id: departmentId },
      rejectWithValue
    )
);

export const fetchCities = createAsyncThunk(
  "lookups/fetchCities",
  async ({ stateId, search = "" }, { rejectWithValue }) =>
    fetchLookup(
      "/lookups/cities",
      "cities",
      { search, page: 1, per_page: 100, state_id: stateId },
      rejectWithValue
    )
);
