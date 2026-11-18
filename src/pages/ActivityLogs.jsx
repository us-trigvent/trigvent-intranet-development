import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Activity, Filter, RotateCcw } from "lucide-react";

import Button from "../components/common/Button";
import DataTable from "../components/common/DataTable";
import { fetchActivityLogs } from "../redux/actions/activityLogActions";

const filterFields = [
  { name: "type", label: "Type", placeholder: "e.g. login" },
  {
    name: "activity_type",
    label: "Activity type",
    placeholder: "e.g. tasks",
  },
  { name: "employee", label: "Employee ID", placeholder: "Employee ID" },
  { name: "user_id", label: "User ID", placeholder: "User ID" },
];

const readPositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value || "", 10);
  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

const getRelationName = (value) => {
  if (value && typeof value === "object") {
    return (
      value.name ||
      value.full_name ||
      value.employee_name ||
      value.user_name ||
      value.email ||
      value.id ||
      ""
    );
  }
  return value ?? "";
};

const getDescription = (log) => {
  const value =
  log.log_description

  if (value && typeof value === "object") {
    return (
      value.description ||
      value.message ||
      value.name ||
      JSON.stringify(value)
    );
  }
  return String(value);
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};

function ActivityLogFilters({ initialValues, onApply, onReset }) {
  const [values, setValues] = useState(initialValues);

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-5 rounded-2xl border border-border-default/80 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-navy">
        <Filter size={17} className="text-brand-teal" />
        Filter activity
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {filterFields.map(({ name, label, placeholder }) => (
          <label
            key={name}
            className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-neutral-600"
          >
            {label}
            <input
              value={values[name] || ""}
              onChange={(event) => updateValue(name, event.target.value)}
              placeholder={placeholder}
              className="min-w-0 rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm font-normal text-text-secondary outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
            />
          </label>
        ))}
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-neutral-600">
          From date/time
          <input
            type="datetime-local"
            value={values.from_date || ""}
            onChange={(event) => updateValue("from_date", event.target.value)}
            className="min-w-0 rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm font-normal text-text-secondary outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-neutral-600">
          To date/time
          <input
            type="datetime-local"
            value={values.to_date || ""}
            onChange={(event) => updateValue("to_date", event.target.value)}
            className="min-w-0 rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm font-normal text-text-secondary outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw size={15} />
          Reset
        </Button>
        <Button type="submit">
          Apply filters
        </Button>
      </div>
    </form>
  );
}

export default function ActivityLogs() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { records, pagination, loading, error } = useSelector(
    (state) => state.activityLogs
  );

  const page = readPositiveInteger(searchParams.get("page"), 1);
  const perPage = readPositiveInteger(searchParams.get("per_page"), 25);
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const appliedFilters = useMemo(
    () =>
      Object.fromEntries(
        [...filterFields.map(({ name }) => name), "from_date", "to_date"].map(
          (key) => [key, searchParams.get(key) || ""]
        )
      ),
    [searchParams]
  );

  const requestParams = useMemo(() => ({
    page,
    per_page: perPage,
    sort,
    order,
    ...Object.fromEntries(
      Object.entries(appliedFilters).filter(([, value]) => value)
    ),
  }), [appliedFilters, order, page, perPage, sort]);

  useEffect(() => {
    dispatch(fetchActivityLogs(requestParams));
  }, [dispatch, requestParams]);

  const updateQueryParams = (updates) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  };

  const handleApplyFilters = (values) => {
    const updates = { page: 1 };
    Object.entries(values).forEach(([key, value]) => {
      updates[key] = value.trim ? value.trim() : value;
    });
    updateQueryParams(updates);
  };

  const handleResetFilters = () => {
    setSearchParams({
      page: "1",
      per_page: String(perPage),
      sort: "created_at",
      order: "desc",
    });
  };

  const handleSort = () => {
    updateQueryParams({
      page: 1,
      sort: "created_at",
      order: order === "asc" ? "desc" : "asc",
    });
  };

  const tableColumns = [
    {
      field: "serialNumber",
      headerName: "Sr.no",
      cellSx: { width: 80, color: "#94A3B8" },
      render: (_, __, index) => index + 1,
    },
    {
      field: "dateTime",
      headerName: "Date Time",
      sortable: true,
      sortActive: true,
      sortDirection: order,
      onSort: handleSort,
      cellSx: { whiteSpace: "nowrap" },
      render: (value) => formatDateTime(value),
    },
    {
      field: "employeeName",
      headerName: "Employee Name",
      render: (value) => value || "—",
    },
    {
      field: "description",
      headerName: "Description",
      render: (value) => (
        <span className="block min-w-64 whitespace-normal break-words">
          {value || "—"}
        </span>
      ),
    },
  ];

  const tableRows = records.map((log, index) => ({
    ...log,
    id: log.id ?? log.uuid ?? `${log.created_at || log.createdAt || "log"}-${index}`,
    dateTime:
      log.created_at ??
      log.createdAt ??
      log.date_time ??
      log.dateTime ??
      log.timestamp,
    employeeName:
      getRelationName(log.employee) ||
      getRelationName(log.employee_name) ||
      getRelationName(log.user),
    description: getDescription(log),
  }));

  const total = Number(pagination?.total || 0);

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-medium text-neutral-500">
            Trigvent / Administration / Activity Logs
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            Activity Logs
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Review employee activity across the intranet.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-brand-teal-soft bg-white px-4 py-2.5 text-sm font-medium text-brand-teal-dark shadow-sm">
          <Activity size={17} />
          {total} {total === 1 ? "record" : "records"}
        </div>
      </header>

      <ActivityLogFilters
        key={searchParams.toString()}
        initialValues={appliedFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white p-4 shadow-sm sm:p-6">
        {error && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
            <p role="alert">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(fetchActivityLogs(requestParams))}
            >
              Retry
            </Button>
          </div>
        )}

        <DataTable
          columns={tableColumns}
          rows={tableRows}
          rowKey="id"
          minWidth={900}
          loading={loading}
          pagination={{
            page,
            perPage,
            total,
            onPageChange: (nextPage) =>
              updateQueryParams({ page: nextPage }),
          }}
        />
      </section>
    </div>
  );
}
