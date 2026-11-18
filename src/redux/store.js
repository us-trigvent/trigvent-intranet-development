import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import announcementReducer from  "./slices/announcementSlice"
import employeeReducer from "./slices/employeeSlice";
import activityLogReducer from "./slices/activityLogSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        announcements: announcementReducer,
        employees: employeeReducer,
        activityLogs: activityLogReducer,
    }
})