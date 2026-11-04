
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import MainLayout from "../Layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import EmployeeDirectory from "../pages/EmployeeDirectory";
import AddEmployee from "../pages/AddEmployee";
import AddIntern from "../pages/AddIntern";
import EmployeeListing from "../pages/EmployeeListing";
import ReleasedEmployees from "../pages/ReleasedEmployees";
import AddToBlacklist from "../pages/AddToBlacklist";
import BlacklistListing from "../pages/BlacklistListing";
import LeaveManagement from "../pages/LeaveManagement";
import AddLeave from "../pages/AddLeave";
import LeaveListing from "../pages/LeaveListing";
import Attendance from "../pages/Attendance";
import Projects from "../pages/Projects";
import Tasks from "../pages/Tasks";
import AddCompOffCredit from "../pages/AddCompOffCredit";
import Settings from "../pages/Settings";
import AddAttendance from "../pages/AddAttendance";
import UploadAttendance from "../pages/UploadAttendance";
import AddProject from "../pages/AddProject";
import AddTask from "../pages/AddTask";
import AddLoan from "../pages/AddLoan";
import PaySlipsSetting from "../pages/PaySlipsSetting";
import AddTrainee from "../pages/AddTrainee";
import AddPayment from "../pages/AddPayment";
import AddInterview from "../pages/AddInterview";
import AddDevice from "../pages/AddDevice";
import ManageRoles from "../pages/ManageRoles";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import PlaceholderPage from "../pages/PlaceholderPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "employees",
        element: <EmployeeDirectory />,
      },
      {
        path: "hr/add-employee",
        element: <AddEmployee />,
      },
      {
        path: "hr/add-intern",
        element: <AddIntern />,
      },
      {
        path: "hr/employee-listing",
        element: <EmployeeListing />,
      },
      {
        path: "hr/released-employees",
        element: <ReleasedEmployees />,
      },
      {
        path: "hr/add-to-blacklist",
        element: <AddToBlacklist />,
      },
      {
        path: "hr/blacklist-listing",
        element: <BlacklistListing />,
      },
      {
        path: "leaves",
        element: <LeaveManagement />,
      },
      {
        path: "leaves/add",
        element: <AddLeave />,
      },
      {
  path: "/leaves/add-comp-off",
  element: <AddCompOffCredit />,
},
      {
        path: "leaves/listing",
        element: <LeaveListing />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "attendance/add",
        element: <AddAttendance/>
      },
      {
        path: "attendance/upload",
        element: <UploadAttendance/>
      },
     
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/add",
        element: <AddProject />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "tasks/add",
        element: <AddTask />,
      },
      {
        path: "financial/add-loan",
        element: <AddLoan />,
      },
      {
        path: "financial/payslips-settings",
        element: <PaySlipsSetting />,
      },
      {
        path: "trainee/add-trainee",
        element: <AddTrainee />,
      },
      {
        path: "trainee/add-payment",
        element: <AddPayment />,
      },
      {
        path: "recruitment/add-interview",
        element: <AddInterview />,
      },
      {
        path: "it/add-device",
        element: <AddDevice />,
      },
      {
        path: "administration/manage-roles",
        element: <ManageRoles />,
      },
      {
        path: "profile/my-profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "*",
        element: <PlaceholderPage title="Page not found" />,
      },
    ],
  },
]);
