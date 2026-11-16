import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import announcementReducer from  "./slices/announcementSlice"
import employeeReducer from "./slices/employeeSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        announcements: announcementReducer,
        employees: employeeReducer,
    }
})