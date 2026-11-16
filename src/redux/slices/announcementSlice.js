
import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAnnouncements,
  fetchAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../actions/announcementActions";

const initialState = {
  announcements: [],
  announcement: null,
  pagination: null,

  loading: false,
  detailLoading: false,
  submitting: false,

  deletingIds: [],
  error: null,
  success: null,
};

const announcementSlice = createSlice({
  name: "announcements",
  initialState,

  reducers: {
    clearAnnouncementError: (state) => {
      state.error = null;
    },

    clearAnnouncementSuccess: (state) => {
      state.success = null;
    },

    clearSelectedAnnouncement: (state) => {
      state.announcement = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH ALL ANNOUNCEMENTS
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;

        const result = action.payload;

        // Supports common Laravel API response structures
        state.announcements =
          result.data?.data ||
          result.data ||
          result.announcements ||
          [];

        state.pagination =
          result.meta ||
          result.pagination ||
          result.data?.meta ||
          result.data?.pagination ||
          null;
      })

      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch announcements";
      })

      // FETCH SINGLE ANNOUNCEMENT
      .addCase(fetchAnnouncementById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })

      .addCase(fetchAnnouncementById.fulfilled, (state, action) => {
        state.detailLoading = false;

        state.announcement =
          action.payload.data || action.payload.announcement || action.payload;
      })

      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      // CREATE ANNOUNCEMENT
      .addCase(createAnnouncement.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = null;
      })

      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.submitting = false;
        state.success =
          action.payload.message || "Announcement created successfully";
      })

      .addCase(createAnnouncement.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // UPDATE ANNOUNCEMENT
      .addCase(updateAnnouncement.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.success = null;
      })

      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.submitting = false;
        state.success =
          action.payload.message || "Announcement updated successfully";
      })

      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // DELETE ANNOUNCEMENT
      .addCase(deleteAnnouncement.pending, (state, action) => {
        state.deletingIds.push(action.meta.arg);
        state.error = null;
      })

      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.payload.id
        );

        state.announcements = state.announcements.filter(
          (item) => item.id !== action.payload.id
        );

        state.success =
          action.payload.response?.message ||
          "Announcement deleted successfully";
      })

      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter(
          (id) => id !== action.meta.arg
        );

        state.error = action.payload || "Failed to delete announcement";
      });
  },
});

export const {
  clearAnnouncementError,
  clearAnnouncementSuccess,
  clearSelectedAnnouncement,
} = announcementSlice.actions;

export default announcementSlice.reducer;
