
import { createSlice } from "@reduxjs/toolkit";
import {
  createDevice,
  fetchDevices,
  deleteDevice,
  fetchDeviceLogs,
  issueDevice,
  recoverDevice
} from "../actions/deviceActions";

const deviceSlice = createSlice({
  name: "devices",

  initialState: {
    records: [],
    pagination: null,
    deleting: {},

    // Issue and Recover API loading state
    deviceActionLoading: {},

    logs: [],
    logsPagination: {
      current_page: 1,
      per_page: 25,
      total: 0,
    },
    logsLoading: false,
    logsError: null,

    loading: false,
    currentRequestId: null,

    creating: false,
    device: null,

    error: null,
    success: null,
  },

  reducers: {
    clearDeviceError: (state) => {
      state.error = null;
    },

    clearDeviceSuccess: (state) => {
      state.success = null;
    },

    clearDeviceStatus: (state) => {
      state.error = null;
      state.success = null;
      state.device = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Devices - Pending
      .addCase(fetchDevices.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })

      // Fetch Devices - Fulfilled
      .addCase(fetchDevices.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        const payload = action.payload;

        const rows = Array.isArray(payload?.data)
          ? payload.data
          : payload?.data?.data || payload?.devices || [];

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

      // Fetch Devices - Rejected
      .addCase(fetchDevices.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.loading = false;
        state.error =
          action.payload || "Failed to fetch devices.";

        state.currentRequestId = null;
      })

      // Create Device - Pending
      .addCase(createDevice.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.success = null;
      })

      // Create Device - Fulfilled
      .addCase(createDevice.fulfilled, (state, action) => {
        state.creating = false;

        state.success =
          action.payload?.message ||
          "Device added successfully.";

        state.device =
          action.payload?.data?.device ||
          action.payload?.data ||
          action.payload?.device ||
          action.payload;

        // Add created device to the existing list
        if (state.device && !Array.isArray(state.device)) {
          state.records = [state.device, ...state.records];
        }
      })

      // Create Device - Rejected
      .addCase(createDevice.rejected, (state, action) => {
        state.creating = false;
        state.error =
          action.payload || "Failed to add device.";
      })

      // Delete Device - Pending
      .addCase(deleteDevice.pending, (state, action) => {
        state.deleting[action.meta.arg] = true;
      })

      // Delete Device - Fulfilled
      .addCase(deleteDevice.fulfilled, (state, action) => {
        const { deviceId } = action.payload;

        delete state.deleting[deviceId];

        state.records = state.records.filter(
          (device) => String(device.id) !== String(deviceId)
        );
      })

      // Delete Device - Rejected
      .addCase(deleteDevice.rejected, (state, action) => {
        delete state.deleting[action.meta.arg];
      })

      .addCase(fetchDeviceLogs.pending, (state) => {
        state.logsLoading = true;
        state.logsError = null;
      })
      .addCase(fetchDeviceLogs.fulfilled, (state, action) => {
        state.logsLoading = false;

        const payload = action.payload.response;
        const result = payload?.data ?? payload;

        state.logs = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        const pagination = Array.isArray(result)
          ? payload?.meta || payload?.pagination
          : result?.meta || result?.pagination || result;

        state.logsPagination = {
          current_page:
            pagination?.current_page ??
            pagination?.currentPage ??
            1,
          per_page:
            pagination?.per_page ??
            pagination?.perPage ??
            25,
          total:
            pagination?.total ??
            state.logs.length,
        };
      })
      .addCase(fetchDeviceLogs.rejected, (state, action) => {
        state.logsLoading = false;
        state.logsError =
          action.payload || "Failed to fetch device logs.";
      })

      .addCase(issueDevice.pending, (state, action) => {
        const deviceId = action.meta.arg.deviceId;
        state.deviceActionLoading[deviceId] = true;
      })
      .addCase(issueDevice.fulfilled, (state, action) => {
        const deviceId = action.payload.deviceId;
        delete state.deviceActionLoading[deviceId];
      })
      .addCase(issueDevice.rejected, (state, action) => {
        const deviceId = action.meta.arg.deviceId;
        delete state.deviceActionLoading[deviceId];
      })

      .addCase(recoverDevice.pending, (state, action) => {
        const deviceId = action.meta.arg.deviceId;
        state.deviceActionLoading[deviceId] = true;
      })
      .addCase(recoverDevice.fulfilled, (state, action) => {
        const deviceId = action.payload.deviceId;
        delete state.deviceActionLoading[deviceId];
      })
      .addCase(recoverDevice.rejected, (state, action) => {
        const deviceId = action.meta.arg.deviceId;
        delete state.deviceActionLoading[deviceId];
      });



  },
});

export const {
  clearDeviceError,
  clearDeviceSuccess,
  clearDeviceStatus,
} = deviceSlice.actions;

export default deviceSlice.reducer;
