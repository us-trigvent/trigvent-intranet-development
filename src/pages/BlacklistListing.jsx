import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, ShieldBan, ShieldCheck, UsersRound } from "lucide-react";
import DataTable from "../components/common/DataTable";
import axiosInstance from "../api/axiosInstance";

const PER_PAGE = 25;

const readBlacklistRows = (payload) => {
  const candidates = [
    payload?.data?.data,
    payload?.data?.records,
    payload?.data?.blacklists,
    payload?.data,
    payload?.records,
    payload?.blacklists,
  ];
  const rows = candidates.find(Array.isArray) || [];

  return rows.map((item) => ({
    ...item,
    id: item.id ?? item.blacklist_id,
    referenceId: item.reference_id ?? item.referenceId ?? item.reference ?? "—",
    employee:
      item.employee_name ??
      item.name ??
      item.employee?.name ??
      item.employee?.full_name ??
      "—",
    entryType: item.entry_type ?? item.entryType ?? "—",
    email: item.email ?? item.employee?.email ?? "—",
    department:
      item.department?.name ??
      item.department_name ??
      item.department ??
      "—",
    designation:
      item.designation?.name ??
      item.designation_name ??
      item.designation ??
      "—",
    date: item.date ?? item.blacklisted_on ?? item.created_at ?? "—",
    status: item.status ?? "—",
    reason: item.reason ?? "—",
  }));
};

const readPagination = (payload) => {
  const source =
    payload?.meta ??
    payload?.pagination ??
    payload?.data?.meta ??
    payload?.data?.pagination ??
    payload?.data ??
    payload ??
    {};

  return {
    page: Number(source.current_page ?? source.page ?? 1),
    perPage: Number(source.per_page ?? source.perPage ?? PER_PAGE),
    total: Number(
      source.total ?? source.total_rec ?? source.total_records ?? 0
    ),
  };
};

const QueryFilter = ({ label, value, placeholder, onApply }) => (
  <input
    key={value}
    type="text"
    defaultValue={value}
    placeholder={placeholder}
    aria-label={label}
    onBlur={(event) => onApply(event.target.value)}
    onKeyDown={(event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onApply(event.currentTarget.value);
        event.currentTarget.blur();
      }
    }}
    className="rounded-xl border border-border-default bg-white px-3.5 py-3 text-sm text-text-secondary outline-none focus:border-brand-teal"
  />
);

export default function BlacklistListing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: PER_PAGE,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageValue = Number.parseInt(searchParams.get("page") || "1", 10);
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const perPageValue = Number.parseInt(
    searchParams.get("per_page") || String(PER_PAGE),
    10
  );
  const perPage =
    Number.isInteger(perPageValue) && perPageValue > 0
      ? perPageValue
      : PER_PAGE;
  const keyword = searchParams.get("keyword") || "";
  const search = searchParams.get("search") || "";
  const department = searchParams.get("department") || "";
  const designation = searchParams.get("designation") || "";
  const entryType = searchParams.get("entry_type") || "";

  const updateQueryParams = useCallback(
    (updates) => {
      setSearchParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === undefined || value === "") {
            nextParams.delete(key);
          } else {
            nextParams.set(key, String(value));
          }
        });
        return nextParams;
      });
    },
    [setSearchParams]
  );

  const loadBlacklist = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = { page, per_page: perPage };
    if (keyword) params.keyword = keyword;
    if (search) params.search = search;
    if (department) params.department = department;
    if (designation) params.designation = designation;
    if (entryType) params.entry_type = entryType;

    try {
      const response = await axiosInstance.get("/blacklist", { params });
      setRecords(readBlacklistRows(response.data));
      setPagination(readPagination(response.data));
    } catch (requestError) {
      setRecords([]);
      setPagination({ page, perPage, total: 0 });
      setError(
        requestError.response?.data?.message ||
          "Failed to load blacklist records."
      );
    } finally {
      setLoading(false);
    }
  }, [department, designation, entryType, keyword, page, perPage, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBlacklist();
  }, [loadBlacklist]);

  const updateFilter = (key, value) => {
    updateQueryParams({ [key]: value.trim(), page: 1 });
  };

  const columns = useMemo(
    () => [
      { field: "referenceId", headerName: "Reference ID" },
      {
        field: "employee",
        headerName: "Employee",
        render: (value, row) => (
          <div>
            <p className="font-semibold text-brand-navy">{value}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{row.entryType}</p>
          </div>
        ),
      },
      { field: "email", headerName: "Email" },
      { field: "department", headerName: "Department" },
      { field: "designation", headerName: "Designation" },
      { field: "date", headerName: "Blacklisted On" },
      {
        field: "status",
        headerName: "Status",
        align: "center",
        render: (value) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              String(value).toLowerCase() === "active"
                ? "bg-danger-soft text-danger-dark"
                : "bg-success-soft text-success-dark"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        field: "reason",
        headerName: "Reason",
        render: (value) => (
          <span className="block max-w-xs whitespace-normal leading-5" title={value}>
            {value}
          </span>
        ),
      },
    ],
    []
  );

  const activeCount = records.filter(
    (record) => String(record.status).toLowerCase() === "active"
  ).length;
  const removedCount = records.filter(
    (record) => String(record.status).toLowerCase() === "removed"
  ).length;

  return (
    <main className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
        <span>Trigvent</span>
        <span className="text-neutral-300">/</span>
        <span>Human Resources</span>
        <span className="text-neutral-300">/</span>
        <span className="text-brand-teal">Blacklist Listing</span>
      </div>

      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
              <ShieldBan size={23} />
            </span>
            Blacklist Listing
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Review and manage employee and intern blacklist records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/hr/add-to-blacklist")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark"
        >
          <Plus size={18} />
          Add to Blacklist
        </button>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Records", value: pagination.total, icon: UsersRound, tone: "bg-info-soft text-info" },
          { label: "Active on This Page", value: activeCount, icon: ShieldBan, tone: "bg-danger-soft text-danger" },
          { label: "Removed on This Page", value: removedCount, icon: ShieldCheck, tone: "bg-success-soft text-success" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="flex items-center justify-between rounded-2xl border border-border-default/80 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm text-neutral-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-brand-navy">{value}</p>
            </div>
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
              <Icon size={21} />
            </span>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <div className="border-b border-border-light px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold text-brand-navy">Blacklist Records</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Search records and filter by entry type, department, or designation.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <QueryFilter
              label="Search"
              value={search}
              placeholder="Search number or identifier"
              onApply={(value) => updateFilter("search", value)}
            />
            <QueryFilter
              label="Department ID"
              value={department}
              placeholder="Department ID"
              onApply={(value) => updateFilter("department", value)}
            />
            <QueryFilter
              label="Designation ID"
              value={designation}
              placeholder="Designation ID"
              onApply={(value) => updateFilter("designation", value)}
            />
            <select
              value={entryType}
              onChange={(event) =>
                updateQueryParams({
                  entry_type: event.target.value,
                  page: 1,
                })
              }
              aria-label="Filter by entry type"
              className="rounded-xl border border-border-default bg-white px-3.5 py-3 text-sm text-text-secondary outline-none focus:border-brand-teal"
            >
              <option value="">All Entry Types</option>
              <option value="employee">Employee</option>
              <option value="intern">Intern</option>
            </select>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {error && (
            <p role="alert" className="mb-4 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger-dark">
              {error}
            </p>
          )}
          <DataTable
            columns={columns}
            rows={records}
            rowKey="id"
            search
            initialSearchValue={keyword}
            searchPlaceholder="Search by keyword..."
            onSearch={(value) => updateFilter("keyword", value)}
            loading={loading}
            pagination={{
              page,
              perPage: pagination.perPage || perPage,
              total: pagination.total,
              onPageChange: (nextPage) =>
                updateQueryParams({ page: nextPage, per_page: perPage }),
            }}
          />
        </div>
      </section>
    </main>
  );
}
