import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const getRows = (payload) =>
  [payload?.data?.data, payload?.data?.relievements, payload?.data, payload?.relievements]
    .find(Array.isArray);

export const fetchRelievements = createAsyncThunk(
  "relievements/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/relievements", { params });
      const payload = response.data;

      if (payload?.success === false) {
        return rejectWithValue(payload.message || "Failed to fetch released employees.");
      }

      const records = getRows(payload);
      if (!Array.isArray(records)) {
        return rejectWithValue("The released employees API returned an invalid response.");
      }

      return {
        records,
        pagination: payload?.meta || payload?.pagination || payload?.data?.meta || payload?.data?.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch released employees."
      );
    }
  }
);

export const fetchRelievementById = createAsyncThunk(
  "relievements/fetchById",
  async (relievementId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/relievements/${relievementId}`);
      const payload = response.data;

      if (payload?.success === false) {
        return rejectWithValue(
          payload.message || "Failed to fetch released employee details."
        );
      }

      const record = [
        payload?.data?.relievement,
        payload?.data?.data,
        payload?.data,
        payload?.relievement,
      ].find((candidate) =>
        candidate && typeof candidate === "object" && !Array.isArray(candidate)
      );

      if (!record) {
        return rejectWithValue(
          "The released employee details API returned an invalid response."
        );
      }

      return record;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          (error.response?.status === 404
            ? "Released employee record not found."
            : error.message) ||
          "Failed to fetch released employee details."
      );
    }
  }
);

export const createRelievement = createAsyncThunk(
  "relievements/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/relievements", data);
      const payload = response.data;

      if (payload?.success === false) {
        return rejectWithValue(
          payload.message || "Failed to add the released employee."
        );
      }

      return payload;
    } catch (error) {
      const responseData = error.response?.data;
      const validationMessage = responseData?.errors
        ? Object.values(responseData.errors).flat().join(" ")
        : "";
      return rejectWithValue(
        responseData?.message ||
          validationMessage ||
          error.message ||
          "Failed to add the released employee."
      );
    }
  }
);

export const updateRelievement = createAsyncThunk(
  "relievements/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/relievements/${id}`, data);
      const payload = response.data;

      if (payload?.success === false) {
        return rejectWithValue(
          payload.message || "Failed to update the released employee."
        );
      }

      return payload;
    } catch (error) {
      const responseData = error.response?.data;
      const validationMessage = responseData?.errors
        ? Object.values(responseData.errors).flat().join(" ")
        : "";
      return rejectWithValue(
        responseData?.message ||
          validationMessage ||
          error.message ||
          "Failed to update the released employee."
      );
    }
  }
);
