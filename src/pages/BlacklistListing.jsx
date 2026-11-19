
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Pencil,
  Plus,
  RotateCcw,
  ShieldBan,
  ShieldCheck,
  Trash2,
  UsersRound,
} from "lucide-react";

import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import DeleteConfirmationDialog from "../components/common/DeleteConfirmationDialog";
import { useToast } from "../components/ToastProvider";

import {
  fetchBlacklistEmployees,
  deleteBlacklistEntry,
  
} from "../redux/actions/blacklistActions";

import {
  fetchDepartments,
  fetchDesignations,
} from "../redux/actions/lookupActions";

import { clearDesignations } from "../redux/slices/lookupSlice";
import LookupDropdown from "../components/common/LookUpDropdown";

const PER_PAGE = 25;

export default function BlacklistListing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Blacklist Redux state
  const {
    records,
    pagination,
    loading,
    error,
    deleting,
  } = useSelector((state) => state.blacklist);

  // Lookup Redux state
  const {
    departments,
    designations,
  } = useSelector((state) => state.lookups);

  // Local UI state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();

  const pageValue = Number.parseInt(searchParams.get("page") || "1", 10);

  const page =
    Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;

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

  // Update URL query parameters
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

  // API parameters
  const params = useMemo(() => {
    const apiParams = {
      page,
      per_page: perPage,
    };

    if (keyword) apiParams.keyword = keyword;
    if (search) apiParams.search = search;
    if (department) apiParams.department = department;
    if (designation) apiParams.designation = designation;
    if (entryType) apiParams.entry_type = entryType;

    return apiParams;
  }, [
    page,
    perPage,
    keyword,
    search,
    department,
    designation,
    entryType,
  ]);

  // Fetch departments when component mounts
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Fetch designations whenever department changes
  useEffect(() => {
    if (!department) {
      dispatch(clearDesignations());
      return;
    }

    dispatch(clearDesignations());
    dispatch(fetchDesignations({ departmentId: department }));
  }, [dispatch, department]);

  // Fetch blacklist records
  useEffect(() => {
    dispatch(fetchBlacklistEmployees(params));
  }, [dispatch, params]);

  // Update regular filters
  const updateFilter = (key, value) => {
    updateQueryParams({
      [key]: value.trim(),
      page: 1,
    });
  };
  const handleClearFilters = () => {
    setSearchParams({});
  };

  // Department selection
  const handleDepartmentChange = (value) => {
    updateQueryParams({
      department: value,
      designation: "",
      page: 1,
    });
  };

  // Designation selection
  const handleDesignationChange = (value) => {
    updateQueryParams({
      designation: value,
      page: 1,
    });
  };

  // Open delete dialog
  const handleDelete = useCallback((row) => {
    setSelectedRecord(row);
    setDeleteDialogOpen(true);
  }, []);

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    if (deleting) return;

    setDeleteDialogOpen(false);
    setSelectedRecord(null);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (selectedRecord?.id == null) return;

    try {
      await dispatch(
        deleteBlacklistEntry(selectedRecord.id)
      ).unwrap();

      showToast({
        type: "success",
        title: "Success",
        message: "Blacklist entry deleted successfully.",
      });

      setDeleteDialogOpen(false);
      setSelectedRecord(null);

      dispatch(fetchBlacklistEmployees(params));
    } catch (error) {
      showToast({
        type: "error",
        title: "Delete Failed",
        message: error || "Failed to delete blacklist entry.",
      });
    }
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Employee Name",
        render: (value) => (
          <p className="font-semibold capitalize text-brand-navy">
            {value}
          </p>
        ),
      },
      {
        field: "email",
        headerName: "Email",
      },
      {
        field: "department",
        headerName: "Department",
        cellSx: {
          minWidth: 180,
          whiteSpace: "nowrap",
        },
        headerSx: {
          minWidth: 180,
        },
      },
      {
        field: "designation",
        headerName: "Designation",
        cellSx: {
          minWidth: 200,
          whiteSpace: "nowrap",
        },
        headerSx: {
          minWidth: 200,
        },
      },
      {
        field: "date",
        headerName: "Blacklisted On",
      },
      {
        field: "action",
        headerName: "Action",
        align: "center",
        cellSx: {
          minWidth: 120,
        },
        render: (_, row) => (
          <div className="flex items-center justify-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
             onClick={() => navigate(`/hr/add-to-blacklist/${row.id}`)}
              title="Edit"
              aria-label="Edit record"
              className="text-info hover:bg-info-soft"
            >
              <Pencil size={15} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(row)}
              title="Delete"
              aria-label="Delete record"
              className="text-danger hover:bg-danger-soft"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <main className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">

      {/* Breadcrumb */}
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
        <span>Trigvent</span>
        <span className="text-neutral-300">/</span>
        <span>Human Resources</span>
        <span className="text-neutral-300">/</span>
        <span className="text-brand-teal">Blacklist Listing</span>
      </div>

      {/* Header */}
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

      {/* Summary cards */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Records",
            value: pagination.total,
            icon: UsersRound,
            tone: "bg-info-soft text-info",
          },
          {
            label: "Active on This Page",
            value: 10,
            icon: ShieldBan,
            tone: "bg-danger-soft text-danger",
          },
          {
            label: "Removed on This Page",
            value: 19,
            icon: ShieldCheck,
            tone: "bg-success-soft text-success",
          },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-border-default/80 bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-sm text-neutral-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-brand-navy">
                {value}
              </p>
            </div>

            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}
            >
              <Icon size={21} />
            </span>
          </div>
        ))}
      </section>

      {/* Blacklist table */}
      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <div className="border-b border-border-light px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold text-brand-navy">
            Blacklist Records
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Search records and filter by entry type, department, or designation.
          </p>

          {/* Filters */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

            <LookupDropdown
              label="Department"
              className="md:w-[16vw]"
              value={department}
              options={departments.records}
              placeholder="Select Department"
              loading={departments.loading}
              error={departments.error}
              onChange={handleDepartmentChange}
            />
            <LookupDropdown
              label="Designation"
              className="md:w-[16vw]"

              value={designation}
              options={designations.records}
              placeholder="Select Designation"
              loading={designations.loading}
              disabled={!department}
              error={designations.error}
              onChange={handleDesignationChange}
            />
            <div className="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-brand-navy">Designation</label>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                disabled={
                  !keyword &&
                  !search &&
                  !department &&
                  !designation &&
                  !entryType &&
                  page === 1
                }
                className="flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Clear Filters
              </Button>
            </div>
          </div>

        </div>

        <div className="p-5 sm:p-6">
          {error && (
            <p className="mb-4 text-sm text-danger" role="alert">
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
                updateQueryParams({
                  page: nextPage,
                  per_page: perPage,
                }),
            }}
          />
        </div>
      </section>

      {/* Delete confirmation */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete blacklist entry?"
        itemName={selectedRecord?.name || selectedRecord?.employee}
        description={`Are you sure you want to delete ${selectedRecord?.name ||
          selectedRecord?.employee ||
          "this record"
          } from the blacklist? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />

    </main>
  );
}
