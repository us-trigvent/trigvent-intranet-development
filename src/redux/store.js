import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import announcementReducer from  "./slices/announcementSlice"
import deviceReducer from "./slices/deviceSlice";
import employeeReducer from "./slices/employeeSlice";
import activityLogReducer from "./slices/activityLogSlice";
import lookupReducer from "./slices/lookupSlice";
import blacklistReducer from "./slices/blacklistSlice";
import relievementReducer from "./slices/relievementSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        announcements: announcementReducer,
        employees: employeeReducer,
        activityLogs: activityLogReducer,
        lookups: lookupReducer,
        blacklist: blacklistReducer,
        relievements: relievementReducer,
        devices: deviceReducer,
    }
})
