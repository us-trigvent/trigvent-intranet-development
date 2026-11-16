
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import {
  Megaphone,
  Pencil,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";

import DataTable from "../components/common/DataTable";
import CreateAnnouncementDialog from "../components/announcement/CreateAnnouncementDialog";
import DeleteConfirmationDialog from "../components/common/DeleteConfirmationDialog";
import { useToast } from "../components/ToastProvider";

import {
  createAnnouncement,
  fetchAnnouncements,
  fetchAnnouncementById,
  deleteAnnouncement,
  updateAnnouncement,
} from "../redux/actions/announcementActions";

export default function Announcements() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const {
    announcements,
    pagination,
    loading,
    deletingIds,
    submitting,
    detailLoading,
  } = useSelector((state) => state.announcements);

  const pageValue = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const perPageValue = Number.parseInt(searchParams.get("per_page") || "10", 10);
  const perPage = Number.isInteger(perPageValue) && perPageValue > 0 ? perPageValue : 10;
  const requestedSort = searchParams.get("sort");
  const sort = ["title", "date"].includes(requestedSort) ? requestedSort : "date";
  const requestedOrder = searchParams.get("order");
  const order = ["asc", "desc"].includes(requestedOrder) ? requestedOrder : "desc";
  const searchTerm = searchParams.get("search") || "";
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dialogMode, setDialogMode] = useState("create");
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const updateQueryParams = useCallback((updates) => {
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
  }, [setSearchParams]);

  const getAnnouncements = useCallback(() => {
    dispatch(
      fetchAnnouncements({
        page: currentPage,
        per_page: perPage,
        search: searchTerm,
        sort,
        order,
      })
    );
  }, [currentPage, dispatch, order, perPage, searchTerm, sort]);

  useEffect(() => {
    getAnnouncements();
  }, [getAnnouncements]);

  const handlePageChange = (page) => {
    updateQueryParams({
      page,
      per_page: perPage,
      sort,
      order,
    });
  };

  const handleSort = useCallback((field) => {
    const nextOrder = sort === field
      ? order === "asc" ? "desc" : "asc"
      : "asc";
    updateQueryParams({
      page: 1,
      per_page: perPage,
      sort: field,
      order: nextOrder,
    });
  }, [order, perPage, sort, updateQueryParams]);

  const handleSearchChange = useCallback((value) => {
    const query = value.trim();
    setSearchParams(query ? new URLSearchParams({ search: query }) : new URLSearchParams());
  }, [setSearchParams]);

  // Delete announcement
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAnnouncement(id)).unwrap();
      setDeleteTarget(null);
      getAnnouncements();
      showToast({
        type: "success",
        title: "Announcement deleted",
        message: "The announcement was deleted successfully.",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "Unable to delete announcement",
        message: error || "Please try again.",
      });
    }
  };

  // Edit announcement
  const handleEdit = useCallback((id) => {
    setDialogMode("edit");
    setEditingAnnouncement(null);
    setIsCreateDialogOpen(true);

    dispatch(fetchAnnouncementById(id))
      .unwrap()
      .then((response) => {
        const record =
          response?.data?.data ||
          response?.data ||
          response?.announcement ||
          response;

        setEditingAnnouncement({
          id: record.id,
          title: record.title || "",
          content: record.content || "",
          date: record.date || "",
          highlight: Boolean(Number(record.highlight)),
        });
      })
      .catch((message) => {
        showToast({
          type: "error",
          title: "Unable to load announcement",
          message: message || "Please try again.",
        });
      });
  }, [dispatch, showToast]);

  // Add announcement
  const handleAdd = () => {
    setDialogMode("create");
    setEditingAnnouncement(null);
    setIsCreateDialogOpen(true);
  };

  const handleCreateAnnouncement = async (data) => {
    if (dialogMode === "edit" && editingAnnouncement?.id) {
      const result = await dispatch(
        updateAnnouncement({ id: editingAnnouncement.id, data })
      );

      if (updateAnnouncement.fulfilled.match(result)) {
        getAnnouncements();
        showToast({
          type: "success",
          title: "Announcement updated",
          message: result.payload?.message || "The announcement was updated successfully.",
        });
        return true;
      }

      showToast({
        type: "error",
        title: "Unable to update announcement",
        message: result.payload || "Please try again.",
      });
      return false;
    }

    const result = await dispatch(createAnnouncement(data));

    if (createAnnouncement.fulfilled.match(result)) {
      getAnnouncements();
      showToast({
        type: "success",
        title: "Announcement created",
        message:
          result.payload?.message || "The announcement was created successfully.",
      });
      return true;
    }

    showToast({
      type: "error",
      title: "Unable to create announcement",
      message: result.payload || "Please try again.",
    });
    return false;
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        field: "srNo",
        headerName: "Sr. No.",
        align: "center",
        render: (value, row, rowIndex) =>
          (currentPage - 1) * perPage + rowIndex + 1,
        cellSx: { width: 90 },
      },
      {
        field: "title",
        headerName: "Title",
        sortable: true,
        sortActive: sort === "title",
        sortDirection: sort === "title" ? order : "asc",
        onSort: () => handleSort("title"),
        render: (value) => (
          <span className="font-semibold text-brand-navy">
            {value}
          </span>
        ),
      },
    {
  field: "content",
  headerName: "Description",
  render: (value) => (
    <div
      className="max-w-[300px] overflow-hidden text-ellipsis text-sm text-text-secondary"
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflowWrap: "anywhere",
      }}
      title={value?.replace(/<[^>]*>/g, "") || ""}
      dangerouslySetInnerHTML={{
        __html: value || "-",
      }}
    />
  ),
},
      {
        field: "date",
        headerName: "Date",
        sortable: true,
        sortActive: sort === "date",
        sortDirection: sort === "date" ? order : "asc",
        onSort: () => handleSort("date"),
        render: (value) =>
          value
            ? new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-",
      },
      {
        field: "highlight",
        headerName: "Highlight",
        align: "center",
        render: (value) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              value
                ? "bg-success-soft text-success-dark"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        ),
      },
      {
        field: "actions",
        headerName: "Action",
        align: "center",
        render: (value, row) => {
          const isDeleting = deletingIds.includes(row.id);

          return (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleEdit(row.id)}
                disabled={isDeleting}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-teal/30 text-brand-teal transition hover:bg-brand-teal-soft disabled:opacity-50"
                title="Edit announcement"
              >
                <Pencil size={15} />
              </button>

              <button
                type="button"
                onClick={() => setDeleteTarget(row)}
                disabled={isDeleting}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-danger/30 text-danger transition hover:bg-danger-soft disabled:opacity-50"
                title="Delete announcement"
              >
                {isDeleting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
            </div>
          );
        },
        cellSx: { whiteSpace: "nowrap", width: 120 },
      },
    ],
    [currentPage, deletingIds, handleEdit, handleSort, order, perPage, sort]
  );

  return (
    <main className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">

      {/* Breadcrumb */}
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
        <span>Trigvent</span>
        <span className="text-neutral-300">/</span>
        <span>Company Settings</span>
        <span className="text-neutral-300">/</span>
        <span className="text-brand-teal">Announcements</span>
      </div>

      {/* Header */}
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
              <Megaphone size={23} />
            </span>
            Announcements
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage company announcements shown to employees.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-teal-dark"
        >
          <Plus size={18} />
          Add Announcement
        </button>
      </header>

      {/* Listing */}
      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">

        <div className="border-b border-border-light px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold text-brand-navy">
            Announcement Listing
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Search, edit, or delete announcements.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <DataTable
            columns={columns}
            rows={announcements}
            rowKey="id"
            search
            initialSearchValue={searchTerm}
            searchPlaceholder="Search announcements..."
            onSearch={handleSearchChange}
            loading={loading}
            pagination={{
              page: currentPage,
              perPage,
              total:
                pagination?.total_rec ||
                pagination?.total ||
                pagination?.total_records ||
                0,
              onPageChange: handlePageChange,
            }}
          />

        </div>
      </section>

      <CreateAnnouncementDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateAnnouncement}
        submitting={submitting}
        initialValues={dialogMode === "edit" ? editingAnnouncement : null}
        mode={dialogMode}
        loading={dialogMode === "edit" && detailLoading}
      />
     <DeleteConfirmationDialog
       open={Boolean(deleteTarget)}
       onClose={() => setDeleteTarget(null)}
       onConfirm={() => handleDelete(deleteTarget?.id)}
       title="Delete announcement?"
       itemName={deleteTarget?.title}
       loading={deleteTarget ? deletingIds.includes(deleteTarget.id) : false}
     />
   </main>
  );
}
