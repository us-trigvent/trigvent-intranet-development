
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// GET: Fetch all announcements
export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const requestParams = params.search?.trim()
        ? { search: params.search.trim() }
        : {
            page: params.page || 1,
            per_page: params.per_page || 10,
            search: params.search || "",
            keyword: params.keyword || "",
            highlight: params.highlight,
            date: params.date,
            from_date: params.from_date,
            to_date: params.to_date,
            sort: params.sort || "date",
            order: params.order || "desc",
          };
      const response = await axiosInstance.get("/announcements", {
        params: requestParams,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch announcements"
      );
    }
  }
);

// GET: Fetch single announcement
export const fetchAnnouncementById = createAsyncThunk(
  "announcements/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/announcements/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch announcement"
      );
    }
  }
);

// POST: Create announcement
export const createAnnouncement = createAsyncThunk(
  "announcements/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/announcements", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create announcement"
      );
    }
  }
);

// PUT: Update announcement
export const updateAnnouncement = createAsyncThunk(
  "announcements/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/announcements/${id}`,
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update announcement"
      );
    }
  }
);

// DELETE: Delete announcement
export const deleteAnnouncement = createAsyncThunk(
  "announcements/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/announcements/${id}`);

      return { id, response: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete announcement"
      );
    }
  }
);
