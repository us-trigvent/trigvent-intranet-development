import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCities,
  fetchDepartments,
  fetchDesignations,
  fetchStates,
} from "../actions/lookupActions";

const initialLookup = {
  records: [],
  loading: false,
  requestId: null,
  error: null,
};

const lookupSlice = createSlice({
  name: "lookups",
  initialState: {
    states: { ...initialLookup },
    departments: { ...initialLookup },
    designations: { ...initialLookup },
    cities: { ...initialLookup },
  },
  reducers: {
    clearDesignations: (state) => {
      state.designations.records = [];
      state.designations.error = null;
    },
    clearCities: (state) => {
      state.cities.records = [];
      state.cities.error = null;
    },
  },
  extraReducers: (builder) => {
    const addLookupCases = (thunk, key) => {
      builder
        .addCase(thunk.pending, (state, action) => {
          state[key].loading = true;
          state[key].error = null;
          state[key].requestId = action.meta.requestId;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          if (state[key].requestId !== action.meta.requestId) return;

          state[key].records = action.payload;
          state[key].loading = false;
          state[key].requestId = null;
        })
        .addCase(thunk.rejected, (state, action) => {
          if (state[key].requestId !== action.meta.requestId) return;

          state[key].loading = false;
          state[key].error = action.payload || "Failed to fetch lookup data.";
          state[key].requestId = null;
        });
    };

    addLookupCases(fetchStates, "states");
    addLookupCases(fetchDepartments, "departments");
    addLookupCases(fetchDesignations, "designations");
    addLookupCases(fetchCities, "cities");
  },
});

export const { clearCities, clearDesignations } = lookupSlice.actions;

export default lookupSlice.reducer;
