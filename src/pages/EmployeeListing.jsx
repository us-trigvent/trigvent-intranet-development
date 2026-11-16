import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
} from "lucide-react";

import EmployeeTable from "../components/employee-form/employee-listing/EmployeeTable";
import {
  fetchEmployees,
  updateEmployeeTrainer,
} from "../redux/actions/employeeActions";
import { useToast } from "../components/ToastProvider";
import { normalizeEmployee } from "../utils/employeeListingUtils";

const sortableFields = [
  "id",
  "name",
  "email",
  "employee_code",
  "created_at",
  "joining_date",
];

const readPositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

function SummaryCard({ title, value, icon: Icon, tone }) {
  const tones = {
    navy: "bg-info-soft text-brand-navy",
    teal: "bg-brand-teal-soft text-brand-teal-dark",
    green: "bg-success-soft text-success-dark",
    red: "bg-danger-soft text-danger",
  };

  return (
    <div className="rounded-2xl border border-border-default/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-brand-navy">
            {value}
          </p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function EmployeeListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    records,
    pagination,
    loading,
    error,
    trainerUpdating,
  } = useSelector((state) => state.employees);
  const page = readPositiveInteger(searchParams.get("page"), 1);
  const pageSize = readPositiveInteger(searchParams.get("per_page"), 25);
  const search = searchParams.get("search")?.trim() || "";
  const employeeStatus =
    searchParams.get("archived") === "1"
      ? "archived"
      : searchParams.get("status") === "1"
        ? "active"
        : "all";
  const internFilter = searchParams.get("is_intern");
  const employeeType =
    internFilter === "1" ? "interns" : internFilter === "0" ? "employees" : "all";
  const trainerFilter = searchParams.get("is_trainer");
  const trainerType =
    trainerFilter === "1"
      ? "trainers"
      : trainerFilter === "0"
        ? "non-trainers"
        : "all";
  const requestedSort = searchParams.get("sort_by");
  const requestedSortOrder = searchParams.get("sort_order");
  const hasValidSort =
    sortableFields.includes(requestedSort) &&
    ["asc", "desc"].includes(requestedSortOrder);
  const sortBy = hasValidSort ? requestedSort : null;
  const sortOrder = hasValidSort ? requestedSortOrder : null;

  const employeeQuery = useMemo(() => ({
    page,
    per_page: pageSize,
    search: search || undefined,
    ...(employeeStatus === "archived"
      ? { archived: 1 }
      : employeeStatus === "active"
        ? { status: 1, archived: 0 }
        : {}),
    ...(employeeType === "all"
      ? {}
      : { is_intern: employeeType === "interns" ? 1 : 0 }),
    ...(trainerType === "all"
      ? {}
      : { is_trainer: trainerType === "trainers" ? 1 : 0 }),
    ...(sortBy ? { sort_by: sortBy, sort_order: sortOrder } : {}),
  }), [
    employeeStatus,
    employeeType,
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    trainerType,
  ]);

  useEffect(() => {
    dispatch(fetchEmployees(employeeQuery));
  }, [
    dispatch,
    employeeQuery,
  ]);

  const employees = useMemo(
    () => records.map(normalizeEmployee),
    [records]
  );
  const activeCount = employees.filter((employee) => employee.active).length;
  const inactiveCount = employees.length - activeCount;
  const internCount = employees.filter((employee) => employee.isIntern).length;
  const totalCount = Number(pagination?.total || 0);


  const updateQueryParams = (updates) => {
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
  };

  const handleSearch = (value) => {
    updateQueryParams({
      search: value.trim(),
      page: 1,
    });
  };

  const handleFilterChange = (filter, value) => {
    const updates = { page: 1 };

    if (filter === "status") {
      updates.status = value === "active" ? 1 : null;
      updates.archived =
        value === "all" ? null : value === "archived" ? 1 : 0;
    } else if (filter === "employeeType") {
      updates.is_intern =
        value === "all" ? null : value === "interns" ? 1 : 0;
    } else if (filter === "trainerType") {
      updates.is_trainer =
        value === "all" ? null : value === "trainers" ? 1 : 0;
    }

    updateQueryParams(updates);
  };

  const handleTrainerChange = async (employee, isTrainer) => {
    try {
      const response = await dispatch(
        updateEmployeeTrainer({ employeeId: employee.id, isTrainer })
      ).unwrap();
      showToast({
        type: "success",
        title: "Trainer status updated",
        message:
          response?.message || "The employee's trainer status was updated.",
      });
      dispatch(fetchEmployees(employeeQuery));
    } catch (message) {
      showToast({
        type: "error",
        title: "Unable to update trainer status",
        message: message || "Please try again.",
      });
    }
  };

  const handleSort = (field) => {
    if (sortBy === field && sortOrder === "desc") {
      updateQueryParams({
        sort_by: null,
        sort_order: null,
        page: 1,
      });
      return;
    }

    const nextSortOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";

    updateQueryParams({
      sort_by: field,
      sort_order: nextSortOrder,
      page: 1,
    });
  };

  const handlePageChange = (nextPage) => {
    updateQueryParams({ page: nextPage });
  };

  const tablePagination = {
    page,
    perPage: pageSize,
    total: totalCount,
    onPageChange: handlePageChange,
  };

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 text-xs font-medium text-neutral-500">
            Trigvent / Human Resources / Employee Listing
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            Employee Listing
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Manage employee and intern records from one place.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Records" value={totalCount} icon={Users} tone="navy" />
        <SummaryCard title="Active on this page" value={activeCount} icon={UserCheck} tone="green" />
        <SummaryCard title="Inactive on this page" value={inactiveCount} icon={UserX} tone="red" />
        <SummaryCard title="Interns on this page" value={internCount} icon={GraduationCap} tone="teal" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm p-6">
        {error && (
          <div className="flex items-center justify-between gap-3 border-b border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
            <p role="alert">{error}</p>
            <button
              type="button"
              onClick={() => dispatch(fetchEmployees(employeeQuery))}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        <EmployeeTable
          key={search}
          employees={employees}
          loading={loading}
          pagination={tablePagination}
          onSearch={handleSearch}
          searchDebounce={400}
          initialSearchValue={search}
          employeeStatus={employeeStatus}
          employeeType={employeeType}
          trainerType={trainerType}
          onFilterChange={handleFilterChange}
          onToggleTrainer={handleTrainerChange}
          trainerUpdating={trainerUpdating}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={(employee) => navigate(`/hr/edit-employee/${employee.id}`)}
          onView={(employee) => navigate(`/hr/employee/${employee.id}`)}
        />
      </section>
    </div>
  );
}
