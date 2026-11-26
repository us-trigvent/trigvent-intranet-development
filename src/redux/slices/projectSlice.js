
import { createSlice } from "@reduxjs/toolkit";
import { createProject } from "../actions/projectActions";

const initialState = {
    creating: false,
    project: null,
    error: null,
    success: null,
};

const projectSlice = createSlice({
    name: "projects",
    initialState,

    reducers: {
        clearProjectError: (state) => {
            state.error = null;
        },

        clearProjectSuccess: (state) => {
            state.success = null;
        },

        clearProjectStatus: (state) => {
            state.error = null;
            state.success = null;
            state.project = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(createProject.pending, (state) => {
                state.creating = true;
                state.error = null;
                state.success = null;
            })

            .addCase(createProject.fulfilled, (state, action) => {
                state.creating = false;
                state.success =
                    action.payload?.message ||
                    "Project created successfully.";

                state.project =
                    action.payload?.data?.project ||
                    action.payload?.data ||
                    action.payload?.project ||
                    action.payload;
            })

            .addCase(createProject.rejected, (state, action) => {
                state.creating = false;
                state.error =
                    action.payload || "Failed to create project.";
            });
    },
});

export const {
    clearProjectError,
    clearProjectSuccess,
    clearProjectStatus,
} = projectSlice.actions;

export default projectSlice.reducer;
