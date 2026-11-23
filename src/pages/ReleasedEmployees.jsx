
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  BriefcaseBusiness,
  Eye,
  Pencil,
  Plus,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import { fetchRelievements } from "../redux/actions/relievementActions";

const readPositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-GB").format(date);
};

// Normalize API response
const normalizeRelievement = (record) => ({
  ...record,
  id: record.id,
  name: record.employee_name || "—",
  employeeCode: record.employee_code || "—",
  department: record.department || "—",
  designation: record.designation || "—",
  resignationDate: formatDate(record.date_of_resignation),
  serviceEndDate: formatDate(record.end_of_services),
  mode: record.mode || "—",
  reason: record.leaving_reason || "—",
  remarks: record.remarks || "—",
  status: record.user_status_label || "—",
});

const modeStyles = {
  Release: "bg-info-soft text-info",
  Terminated: "bg-danger-soft text-danger",
  "Lay off": "bg-warning-soft text-warning-dark",
};

function SummaryCard({ title, value, icon: Icon, tone }) {
  const tones = {
    navy: "bg-info-soft text-brand-navy",
    green: "bg-success-soft text-success-dark",
    red: "bg-danger-soft text-danger",
    teal: "bg-brand-teal-soft text-brand-teal-dark",
  };

  return (
    <div className="rounded-2xl border border-border-default/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-brand-navy">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function ReleasedEmployeeListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    records = [],
    pagination,
    loading,
    error,
  } = useSelector((state) => state.relievements);

  const page = readPositiveInteger(searchParams.get("page"), 1);
  const perPage = readPositiveInteger(searchParams.get("per_page"), 25);
  const search = searchParams.get("search")?.trim() || "";
  const mode = searchParams.get("mode") || "";

  const query = useMemo(
    () => ({
      page,
      per_page: perPage,
      search: search || undefined,
      mode: mode || undefined,
    }),
    [mode, page, perPage, search]
  );

  useEffect(() => {
    dispatch(fetchRelievements(query));
  }, [dispatch, query]);

  const releasedEmployees = useMemo(
    () => records.map(normalizeRelievement),
    [records]
  );

  const totalCount = Number(
    pagination?.total ?? releasedEmployees.length
  );

  const currentPage = Number(
    pagination?.current_page ?? page
  );

  const currentPerPage = Number(
    pagination?.per_page ?? perPage
  );

  const updateQueryParams = (updates) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === ""
        ) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });

      return next;
    });
  };

  // Summary counts
  const summaryCards = [
    {
      title: "Total Records",
      value: totalCount,
      icon: Users,
      tone: "navy",
    },
    {
      title: "Released",
      value: releasedEmployees.filter(
        (employee) => employee.mode === "Release"
      ).length,
      icon: UserCheck,
      tone: "green",
    },
    {
      title: "Terminated",
      value: releasedEmployees.filter(
        (employee) => employee.mode === "Terminated"
      ).length,
      icon: UserX,
      tone: "red",
    },
    {
      title: "Lay off",
      value: releasedEmployees.filter(
        (employee) => employee.mode === "Lay off"
      ).length,
      icon: BriefcaseBusiness,
      tone: "teal",
    },
  ];

  const columns = [
    {
      field: "serialNumber",
      headerName: "SL",
      cellSx: { width: 70, color: "#94A3B8" },
      render: (_, __, index) =>
        (currentPage - 1) * currentPerPage + index + 1,
    },
    {
      field: "name",
      headerName: "Name",
      render: (value, employee) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-teal-soft text-xs font-bold text-brand-teal-dark">
            {value
              ?.split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase() || "NA"}
          </div>

          <div>
            <p className="whitespace-nowrap font-semibold text-brand-navy">
              {value}
            </p>
            <p className="mt-0.5 text-xs text-neutral-400">
              {employee.designation}
            </p>
          </div>
        </div>
      ),
    },
    {
      field: "employeeCode",
      headerName: "Employee ID",
    },
    {
      field: "department",
      headerName: "Department",
    },
    {
      field: "designation",
      headerName: "Designation",
      cellSx: { minWidth: 220 },
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
        <span
          className={`inline-flex whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold ${modeStyles[value] ||
            "bg-surface-muted text-neutral-600"
            }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "reason",
      headerName: "Leaving Reason",
      cellSx: { minWidth: 200 },
    },

    {
      field: "remarks",
      headerName: "Remarks",
      cellSx: { minWidth: 200 },
    },
    {
      field: "status",
      headerName: "Status",
      render: (value) => (
        <span
          className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${value === "Active"
              ? "bg-success-soft text-success-dark"
              : value === "Inactive"
                ? "bg-danger-soft text-danger"
                : "bg-surface-muted text-neutral-600"
            }`}
        >
          {value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      render: (_, employee) => (
        <div className="flex items-center justify-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            title={`Edit ${employee.name}`}
            aria-label={`Edit ${employee.name}`}
            onClick={() =>
              navigate(
                `/hr/released-employees/edit/${employee.id}`
              )
            }
            className="text-info hover:border-info-soft hover:bg-info-soft"
          >
            <Pencil size={15} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            title={`View ${employee.name}`}
            aria-label={`View ${employee.name}`}
            onClick={() =>
              navigate(
                `/hr/released-employees/view/${employee.id}`
              )
            }
            className="text-brand-teal-dark hover:border-brand-teal-soft hover:bg-brand-teal-soft"
          >
            <Eye size={15} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 text-xs font-medium text-neutral-500">
            Trigvent / Human Resources / Released Employees
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            Released Employee Listing
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage employee exits, release records, and service-end details.
          </p>
        </div>

        <Button
          onClick={() =>
            navigate("/hr/released-employees/add")
          }
          className="self-start sm:self-auto"
        >
          <Plus size={18} />
          Add New
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* Listing Table */}
      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white p-5 shadow-sm sm:p-6">
        {error && (
          <div className="mb-4 flex items-center justify-between gap-3 border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
            <p role="alert">{error}</p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(fetchRelievements(query))}
              className="shrink-0 border-danger/30 text-danger hover:bg-danger-soft"
            >
              Retry
            </Button>
          </div>
        )}

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-neutral-600">
            Mode

            <select
              value={mode}
              onChange={(event) =>
                updateQueryParams({
                  mode: event.target.value,
                  page: 1,
                })
              }
              className="min-w-0 rounded-full border border-border-default bg-white px-3 py-2 text-sm font-normal text-brand-navy outline-none focus:border-brand-teal"
            >
              <option value="">All modes</option>
              <option value="Release">Release</option>
              <option value="Terminated">Terminated</option>
              <option value="Lay off">Lay off</option>
            </select>
          </label>

          <p className="self-end pb-2 text-sm text-neutral-500">
            Showing {releasedEmployees.length} of {totalCount} records
          </p>
        </div>

        <DataTable
          columns={columns}
          rows={releasedEmployees}
          rowKey="id"
          rowsPerPage={currentPerPage}
          minWidth={1500}
          search
          searchPlaceholder="Search released employees..."
          initialSearchValue={search}
          searchValue={search}
          onSearch={(value) =>
            updateQueryParams({
              search: value.trim(),
              page: 1,
            })
          }
          loading={loading}
          pagination={{
            page: currentPage,
            perPage: currentPerPage,
            total: totalCount,
            onPageChange: (nextPage) =>
              updateQueryParams({ page: nextPage }),
          }}
        />
      </section>
    </main>
  );
}
