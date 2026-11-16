import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Loader2,
  PartyPopper,
  Pencil,
  Plus,
  Trash2,
  UsersRound,
} from "lucide-react";
import DataTable from "../components/common/DataTable";
import CreateCelebrationDialog from "../components/celebration/CreateCelebrationDialog";
import DeleteConfirmationDialog from "../components/common/DeleteConfirmationDialog";
import { useToast } from "../components/ToastProvider";
import axiosInstance from "../api/axiosInstance";

const DEFAULT_PER_PAGE = 25;

const getRows = (payload) => {
  const candidates = [
    payload?.data?.data,
    payload?.data?.celebrations,
    payload?.celebrations,
    payload?.data,
  ];
  const rows = candidates.find(Array.isArray) || [];

  return rows.map((item) => ({
    id: item.id ?? item.celebration_id,
    imageUrl: item.image_url ?? "",
    name: item.name ?? item.employee?.name ?? "—",
    heading: item.display_heading ?? item.heading ?? "—",
    eventDate: item.event_date ?? "—",
    isDisable: item.is_disable ?? item.is_disabled ?? false,
  }));
};

const getPagination = (payload, fallbackPage, fallbackPerPage) => {
  const source =
    payload?.meta ??
    payload?.pagination ??
    payload?.data?.meta ??
    payload?.data?.pagination ??
    payload?.data ??
    payload ??
    {};

  return {
    page: Number(source.current_page ?? source.page ?? fallbackPage),
    perPage: Number(source.per_page ?? source.perPage ?? fallbackPerPage),
    total: Number(
      source.total ?? source.total_rec ?? source.total_records ?? 0
    ),
  };
};

const isDisabled = (value) =>
  value === true || value === 1 || value === "1" || value === "true";

export default function Celebrations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const [records, setRecords] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: DEFAULT_PER_PAGE,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const parsedPerPage = Number.parseInt(
    searchParams.get("per_page") || String(DEFAULT_PER_PAGE),
    10
  );
  const perPage =
    Number.isInteger(parsedPerPage) && parsedPerPage > 0
      ? parsedPerPage
      : DEFAULT_PER_PAGE;
  const keyword = searchParams.get("keyword") || "";
  const userId = searchParams.get("user_id") || "";
  const isDisable = searchParams.get("is_disable") || "";
  const status = searchParams.get("status") || "active";
  const requestedSort = searchParams.get("sort") || "event_date";
  const sort = ["event_date", "id"].includes(requestedSort)
    ? requestedSort
    : "event_date";
  const requestedOrder = (searchParams.get("order") || "asc").toLowerCase();
  const order = ["asc", "desc"].includes(requestedOrder)
    ? requestedOrder
    : "asc";

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

  const loadCelebrations = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = {
      page,
      per_page: perPage,
      keyword,
      user_id: userId,
      is_disable: isDisable,
      status,
      sort,
      order,
    };

    try {
      const response = await axiosInstance.get("/celebrations", { params });
      setRecords(getRows(response.data));
      setPagination(getPagination(response.data, page, perPage));
    } catch (requestError) {
      setRecords([]);
      setPagination({ page, perPage, total: 0 });
      setError(
        requestError.response?.data?.message ||
          "Failed to load celebrations."
      );
    } finally {
      setLoading(false);
    }
  }, [isDisable, keyword, order, page, perPage, sort, status, userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCelebrations();
  }, [loadCelebrations]);

  const updateFilter = (key, value) => {
    updateQueryParams({ [key]: value.trim(), page: 1 });
  };

  const handleDelete = async (id) => {
    if (id == null) return;

    setDeletingId(id);
    try {
      const response = await axiosInstance.delete(`/celebrations/${id}`);
      setDeleteTarget(null);
      await loadCelebrations();
      showToast({
        type: "success",
        title: "Celebration deleted",
        message:
          response.data?.message || "The celebration was deleted successfully.",
      });
    } catch (requestError) {
      showToast({
        type: "error",
        title: "Unable to delete celebration",
        message:
          requestError.response?.data?.message ||
          requestError.message ||
          "Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (values) => {
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("user_id", values.userId);
      formData.append("event_date", values.eventDate);
      formData.append("heading", values.heading);
      formData.append(
        "anniversary_year",
        values.heading === "Anniversary" ? values.anniversaryYear : ""
      );
      formData.append("is_disable", "");
      formData.append("image", values.image);

      const response = await axiosInstance.post("/celebrations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadCelebrations();
      showToast({
        type: "success",
        title: "Celebration added",
        message:
          response.data?.message || "The celebration was added successfully.",
      });
      return true;
    } catch (requestError) {
      showToast({
        type: "error",
        title: "Unable to add celebration",
        message:
          requestError.response?.data?.message ||
          requestError.message ||
          "Please try again.",
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  const handleSort = useCallback(
    (field) => {
      updateQueryParams({
        page: 1,
        sort: field,
        order: sort === field && order === "asc" ? "desc" : "asc",
      });
    },
    [order, sort, updateQueryParams]
  );

  const columns = useMemo(
    () => [
      {
        field: "serialNumber",
        headerName: "Sr.No.",
        render: (_, _row, index) => index + 1,
      },
      {
        field: "imageUrl",
        headerName: "Image",
        render: (value, row) =>
          value ? (
            <img
              src={value}
              alt={`${row.name} celebration`}
              className="mx-auto h-10 w-10 rounded-full object-cover"
            />
          ) : (
            "—"
          ),
      },
      { field: "name", headerName: "Name" },
      { field: "heading", headerName: "Heading" },
      {
        field: "eventDate",
        headerName: "Date",
        sortable: true,
        sortActive: sort === "event_date",
        sortDirection: sort === "event_date" ? order : "asc",
        onSort: () => handleSort("event_date"),
      },
      {
        field: "isDisable",
        headerName: "Status",
        align: "center",
        render: (value) => (
          <span className="inline-flex rounded-md bg-danger px-2.5 py-1 text-xs font-semibold text-white">
            {isDisabled(value) ? "Enable" : "Disable"}
          </span>
        ),
      },
      {
        field: "actions",
        headerName: "Action",
        align: "center",
        render: (_, row) => (
          <div className="flex items-center justify-center gap-2">
            <span
              title="Edit celebration"
              aria-label={`Edit ${row.name}`}
              className="inline-flex rounded-lg border border-border-default bg-info-soft p-2 text-info shadow-sm"
            >
              <Pencil size={15} />
            </span>
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              disabled={deletingId === row.id}
              title="Delete celebration"
              aria-label={`Delete ${row.name}`}
              className="inline-flex rounded-lg border border-border-default bg-danger-soft p-2 text-danger shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingId === row.id ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
            </button>
          </div>
        ),
      },
    ],
    [deletingId, handleSort, order, sort]
  );

  const disabledCount = records.filter((record) =>
    isDisabled(record.isDisable)
  ).length;

  return (
    <main className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
        <span>Trigvent</span>
        <span className="text-neutral-300">/</span>
        <span>Company Settings</span>
        <span className="text-neutral-300">/</span>
        <span className="text-brand-teal">Celebrations</span>
      </div>

      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
              <PartyPopper size={23} />
            </span>
            Celebrations
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            View and manage employee celebrations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateDialogOpen(true)}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-brand-teal px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark sm:self-auto"
        >
          <Plus size={18} />
          Add Celebration
        </button>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Celebrations",
            value: pagination.total,
            icon: PartyPopper,
            tone: "bg-info-soft text-info",
          },
          {
            label: "Active on This Page",
            value: records.filter((record) => !isDisabled(record.isDisable))
              .length,
            icon: UsersRound,
            tone: "bg-success-soft text-success-dark",
          },
          {
            label: "Disabled on This Page",
            value: disabledCount,
            icon: CalendarDays,
            tone: "bg-neutral-100 text-neutral-500",
          },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-border-default/80 bg-white p-5 shadow-sm"
          >
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
          <h2 className="text-base font-semibold text-brand-navy">
            Celebration Listing
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Search, filter, and sort employee celebrations.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <input
              type="number"
              min="1"
              defaultValue={userId}
              onBlur={(event) =>
                updateFilter("user_id", event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  updateFilter("user_id", event.currentTarget.value);
                  event.currentTarget.blur();
                }
              }}
              placeholder="User ID"
              aria-label="Filter by user ID"
              className="rounded-xl border border-border-default bg-white px-3.5 py-3 text-sm text-text-secondary outline-none focus:border-brand-teal"
            />
            <select
              value={isDisable}
              onChange={(event) =>
                updateQueryParams({ is_disable: event.target.value, page: 1 })
              }
              aria-label="Filter by disabled status"
              className="rounded-xl border border-border-default bg-white px-3.5 py-3 text-sm text-text-secondary outline-none focus:border-brand-teal"
            >
              <option value="">All disable states</option>
              <option value="0">Enabled</option>
              <option value="1">Disabled</option>
            </select>
            <select
              value={status}
              onChange={(event) =>
                updateQueryParams({ status: event.target.value, page: 1 })
              }
              aria-label="Filter by status"
              className="rounded-xl border border-border-default bg-white px-3.5 py-3 text-sm text-text-secondary outline-none focus:border-brand-teal"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger-dark"
            >
              {error}
            </p>
          )}
          <DataTable
            columns={columns}
            rows={records}
            rowKey="id"
            loading={loading}
            search
            searchPlaceholder="Search celebrations..."
            initialSearchValue={keyword}
            onSearch={(value) => updateFilter("keyword", value)}
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
      <DeleteConfirmationDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget?.id)}
        title="Delete celebration?"
        itemName={deleteTarget?.name}
        loading={deleteTarget ? deletingId === deleteTarget.id : false}
      />
      <CreateCelebrationDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreate}
        submitting={creating}
      />
    </main>
  );
}
