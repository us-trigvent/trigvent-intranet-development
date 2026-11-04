import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Eye,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

import DataTable from "../components/common/DataTable";

const releasedEmployees = [
  {
    id: 1,
    name: "Gagandeep Singh",
    employeeCode: "16",
    resignationDate: "01-03-2026",
    serviceEndDate: "01-04-2026",
    mode: "Release",
    reason: "Better Opportunity",
    remarks: "Best of Luck",
    type: "Employee",
  },
  {
    id: 2,
    name: "Rahul Gupta",
    employeeCode: "1234",
    resignationDate: "01-07-2025",
    serviceEndDate: "31-07-2025",
    mode: "Release",
    reason: "For testing purpose",
    remarks: "For testing purpose",
    type: "Employee",
  },
  {
    id: 3,
    name: "Anne Here",
    employeeCode: "1231232566",
    resignationDate: "10-12-2024",
    serviceEndDate: "10-12-2024",
    mode: "Release",
    reason: "Test",
    remarks: "Test",
    type: "Employee",
  },
  {
    id: 4,
    name: "B B",
    employeeCode: "1231232131",
    resignationDate: "03-12-2024",
    serviceEndDate: "10-12-2024",
    mode: "Terminated",
    reason: "Test",
    remarks: "Test1",
    type: "Employee",
  },
  {
    id: 5,
    name: "A B",
    employeeCode: "24680",
    resignationDate: "07-12-2024",
    serviceEndDate: "07-12-2024",
    mode: "Release",
    reason: "Test",
    remarks: "Test",
    type: "Employee",
  },
  {
    id: 6,
    name: "A B",
    employeeCode: "98123",
    resignationDate: "20-11-2024",
    serviceEndDate: "26-11-2024",
    mode: "Lay off",
    reason: "Test",
    remarks: "Test",
    type: "Employee",
  },
  {
    id: 7,
    name: "A B",
    employeeCode: "65789",
    resignationDate: "01-11-2024",
    serviceEndDate: "21-11-2024",
    mode: "Lay off",
    reason: "Other",
    remarks: "—",
    type: "Employee",
  },
  {
    id: 8,
    name: "A B",
    employeeCode: "66644",
    resignationDate: "06-12-2024",
    serviceEndDate: "07-12-2024",
    mode: "Terminated",
    reason: "Test",
    remarks: "Test",
    type: "Employee",
  },
];

const modeStyles = {
  Release: {
    bgcolor: "#EAF3FF",
    color: "#1769F5",
  },
  Terminated: {
    bgcolor: "#FFF0F0",
    color: "#D14343",
  },
  "Lay off": {
    bgcolor: "#FFF5E5",
    color: "#A66500",
  },
};

export default function ReleasedEmployeeListing() {
  const navigate = useNavigate();
  const [employeeType, setEmployeeType] = useState("All");


  const columns = [
    {
      field: "serialNumber",
      headerName: "Sr. No.",
      cellSx: { width: 75, fontWeight: 600 },
      render: (_, row) =>
        releasedEmployees.findIndex(
          (employee) => employee.id === row.id
        ) + 1,
    },
    {
      field: "name",
      headerName: "Employee",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F7F6] text-xs font-bold text-[#087F80]">
            {value
              ?.split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase() || "NA"}
          </div>
          <div>
            <p className="whitespace-nowrap text-sm font-semibold text-[#203D61]">
              {value}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {row.type || "Team member"}
            </p>
          </div>
        </div>
      ),
    },
    {
      field: "employeeCode",
      headerName: "Employee Code",
    },
    {
      field: "resignationDate",
      headerName: "Resignation Date",
    },
    {
      field: "serviceEndDate",
      headerName: "Service End Date",
    },
    {
      field: "mode",
      headerName: "Mode",
      render: (value) => (
        <Chip
          label={value}
          size="small"
          sx={{
            ...modeStyles[value],
            fontWeight: 600,
            fontSize: "0.72rem",
            height: 25,
            borderRadius: "7px",
          }}
        />
      ),
    },
    {
      field: "reason",
      headerName: "Reason",
    },
    {
      field: "remarks",
      headerName: "Remarks",
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            title={`Edit ${row.name}`}
            aria-label={`Edit ${row.name}`}
            onClick={() => navigate(`/hr/released-employees/edit/${row.id}`)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-sky-600 shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            title={`View ${row.name}`}
            aria-label={`View ${row.name}`}
            onClick={() => navigate(`/hr/released-employees/view/${row.id}`)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-[#087F80] shadow-sm transition hover:border-teal-200 hover:bg-teal-50"
          >
            <Eye size={15} />
          </button>
          <button
            type="button"
            title={`Delete ${row.name}`}
            aria-label={`Delete ${row.name}`}
            onClick={() => window.confirm(`Delete ${row.name}?`)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-rose-500 shadow-sm transition hover:border-rose-200 hover:bg-rose-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5F8FC] px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      {/* Breadcrumb */}
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
        <span>Trigvent</span>
        <span>/</span>
        <span>Human Resources</span>
        <span>/</span>
        <span className="font-medium text-[#203D61]">
          Released Employees
        </span>
      </div>

      {/* Page heading */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#6A9BFF] sm:text-3xl">
            Released Employee Listing
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage employee exits, release records, and service-end details.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-medium text-[#203D61] shadow-sm sm:self-auto">
          <Users size={17} className="text-blue-500" />
          {releasedEmployees.length} records
        </div>
      </div>

      {/* Main listing panel */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          border: "1px solid #E2EAF3",
          borderRadius: "18px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 16px rgba(32, 61, 97, 0.045)",
        }}
      >
        {/* Table toolbar */}
        <Box
          sx={{
            mb: 2.5,
            display: "flex",
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#203D61",
              }}
            >
              All Released Records
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: "0.82rem",
                color: "#8492A6",
              }}
            >
              Review and update employee exit information.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() =>
              navigate("/hr/released-employees/add")
            }
            startIcon={<Plus size={18} />}
            sx={{
              alignSelf: { xs: "stretch", sm: "auto" },
              borderRadius: "10px",
              px: 2.5,
              py: 1.15,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#1769F5",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#0F55D4",
                boxShadow: "0 4px 12px rgba(23, 105, 245, 0.18)",
              },
            }}
          >
            Add New
          </Button>
        </Box>

        {/* Employee type filter */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2.5,
            flexWrap: "wrap",
          }}
        >
          <TextField
            select
            size="small"
            label="Employee Type"
            value={employeeType}
            onChange={(event) =>
              setEmployeeType(event.target.value)
            }
            sx={{
              width: { xs: "100%", sm: 230 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
                fontSize: "0.875rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.875rem",
              },
            }}
          >
            <MenuItem value="All">All Employee Types</MenuItem>
            <MenuItem value="Employee">Employees</MenuItem>
            <MenuItem value="Intern">Interns</MenuItem>
          </TextField>

          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#8492A6",
            }}
          >
            Showing {releasedEmployees.length} records
          </Typography>
        </Box>

        {/* Shared dynamic MUI table */}
        <DataTable
          columns={columns}
          rows={releasedEmployees}
          rowKey="id"
          rowsPerPage={10}
          minWidth={1100}
          showSearch
          searchPlaceholder="Search employee records..."
        />
      </Paper>
    </main>
  );
}