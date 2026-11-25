
import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Pencil,
    RotateCcw,
    Trash2,
    History,
    Loader2,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import Button from "../common/Button";
import DataTable from "../common/DataTable";
import { useToast } from "../ToastProvider";

import {
    fetchDevices,
    deleteDevice,
} from "../../redux/actions/deviceActions";

import { fetchEmployees } from "../../redux/actions/employeeActions";

const DEFAULT_FILTERS = {
    category: "",
    employee: "",
    type: "available",
    filter: "1",
};

const selectClass =
    "h-10 w-full min-w-0 rounded-md border border-border-default bg-white px-3 text-sm font-normal text-brand-navy outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10";

export default function DeviceTable({
    onEdit,
    onRecover,
    onLogs,
    initialSearchValue = "",
    searchDebounce = 400,
}) {
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const [selectedDevice, setSelectedDevice] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const readPositiveInteger = (value, fallback) => {
        const parsed = Number.parseInt(value, 10);
        return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
    };

    const category = searchParams.get("category") || "";
    const employee = searchParams.get("employee") || "";
    const type = searchParams.get("type") || "available";
    const filter = searchParams.get("filter") || "1";
    const search = searchParams.get("search") || "";
    const page = readPositiveInteger(searchParams.get("page"), 1);
    const perPage = readPositiveInteger(searchParams.get("per_page"), 25);
    const {
        records: devices = [],
        loading,
        error,
        pagination,
        deleting = {},
    } = useSelector((state) => state.devices);

    const employees = useSelector(
        (state) => state.employees?.records || []
    );

    // Load employee dropdown options
    useEffect(() => {
        dispatch(fetchEmployees({ page: 1, per_page: 100 }));
    }, [dispatch]);

    // Build API query
    const query = useMemo(
        () => ({
            filter: Number(filter),
            type,
            category: category || undefined,
            employee: employee || undefined,
            search: search.trim() || undefined,
            page,
            per_page: perPage,
        }),
        [filter, type, category, employee, search, page, perPage]
    );
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
    // Fetch devices whenever search, filters or page changes
    useEffect(() => {
        dispatch(fetchDevices(query));
    }, [dispatch, query]);

    // Display API errors
    useEffect(() => {
        if (error && !loading) {
            showToast({
                type: "error",
                title: "Unable to Load Devices",
                message: error,
            });
        }
    }, [error, loading, showToast]);

    // Dropdown handler
    const handleFilterChange = (name, value) => {
        updateQueryParams({
            [name]: value,
            page: 1,
        });
    };

    // DataTable search handler
    const handleSearch = useCallback(
        (value) => {
            updateQueryParams({
                search: value.trim(),
                page: 1,
            });
        },
        [setSearchParams]
    );

    // Archive device
    const handleDeleteClick = (device) => {
        const isIssued =
            Number(device.is_issued) === 1 || device.is_issued === true;

        if (isIssued) {
            showToast({
                type: "warning",
                title: "Action Not Allowed",
                message: "Issued devices cannot be archived.",
            });
            return;
        }

        setSelectedDevice(device);
    };

    const handleConfirmDelete = async () => {
        if (!selectedDevice) return;

        try {
            const response = await dispatch(
                deleteDevice(selectedDevice.id)
            ).unwrap();

            showToast({
                type: "success",
                title: "Device Archived",
                message: response?.message || "Device archived successfully.",
            });

            setSelectedDevice(null);
        } catch (error) {
            showToast({
                type: "error",
                title: "Archive Failed",
                message:
                    typeof error === "string"
                        ? error
                        : "Failed to archive device.",
            });
        }
    };

    // Category options: unique categories from loaded device records
    const categories = useMemo(() => {
        return [...new Set(
            devices
                .map((device) => device.category)
                .filter(Boolean)
        )].sort();
    }, [devices]);

    // Table columns
    const tableColumns = useMemo(
        () => [
            {
                field: "serialNumber",
                headerName: "Sr. No.",
                cellSx: {
                    width: 75,
                    color: "#64748B",
                    fontWeight: 600,
                },
                render: (_, __, index) =>
                    (page - 1) * perPage + index + 1,
            },
            {
                field: "category",
                headerName: "Category",
            },
            {
                field: "device_code",
                headerName: "Device Code",
            },
            {
                field: "serial_number",
                headerName: "Device Sr. No.",
            },
            {
                field: "brand",
                headerName: "Brand",
            },
            {
                field: "condition",
                headerName: "Condition",
                render: (value) => (
                    <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${value === "Working"
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                            }`}
                    >
                        {value || "—"}
                    </span>
                ),
            },
            {
                field: "is_issued",
                headerName: "Issued",
                align: "center",
                render: (value) => {
                    const issued =
                        Number(value) === 1 || value === true;

                    return (
                        <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${issued
                                ? "bg-info-soft text-info"
                                : "bg-surface-muted text-neutral-500"
                                }`}
                        >
                            {issued ? "Yes" : "No"}
                        </span>
                    );
                },
            },
            {
                field: "issuedTo",
                headerName: "Issued To",
                render: (_, device) => {
                    const employee =
                        device.issued_to_employee ||
                        device.employee ||
                        (typeof device.issued_to === "object"
                            ? device.issued_to
                            : null);

                    const employeeName =
                        device.issued_to_name ||
                        device.employee_name ||
                        employee?.employee_name ||
                        employee?.name;

                    const issued =
                        Number(device.is_issued) === 1 ||
                        device.is_issued === true;

                    return (
                        <span className="whitespace-nowrap">
                            {issued
                                ? employeeName || "Employee Assigned"
                                : "No Employee Assigned"}
                        </span>
                    );
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                align: "center",
                render: (_, device) => {
                    const isIssued =
                        Number(device.is_issued) === 1 ||
                        device.is_issued === true;

                    const isDeleting = Boolean(deleting[device.id]);

                    return (
                        <div className="flex items-center justify-center gap-1.5">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onEdit?.(device)}
                                title="Edit device"
                                aria-label="Edit device"
                                className="text-info hover:bg-info-soft"
                            >
                                <Pencil size={15} />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onRecover?.(device)}
                                title="Recover device"
                                aria-label="Recover device"
                                className="text-warning-dark hover:bg-warning-soft"
                            >
                                <RotateCcw size={15} />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteClick(device)}
                                title={
                                    isIssued
                                        ? "Cannot archive an issued device"
                                        : "Archive device"
                                }
                                aria-label="Archive device"
                                disabled={isIssued || isDeleting}
                                className="text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isDeleting ? (
                                    <Loader2 size={15} className="animate-spin" />
                                ) : (
                                    <Trash2 size={15} />
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onLogs?.(device)}
                                title="Device logs"
                                aria-label="Device logs"
                                className="text-brand-teal-dark hover:bg-brand-teal-soft"
                            >
                                <History size={15} />
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [page, perPage, deleting, onEdit, onRecover, onLogs]
    );

    const totalCount = Number(
        pagination?.total ?? devices.length
    );

    return (
        <div className="w-full">
            {/* Device Filters */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {/* Category */}
                <select
                    value={category}
                    onChange={(event) =>
                        handleFilterChange("category", event.target.value)
                    }
                    className={selectClass}
                    aria-label="Filter by category"
                >
                    <option value="">Select Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                {/* Employee */}
                <select
                    value={employee}
                    onChange={(event) =>
                        handleFilterChange("employee", event.target.value)
                    }
                    className={selectClass}
                    aria-label="Filter by employee"
                >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.employee_name ||
                                employee.name ||
                                employee.full_name ||
                                `Employee ${employee.id}`}
                        </option>
                    ))}
                </select>

                {/* Availability */}
                <select
                    value={type}
                    onChange={(event) =>
                        handleFilterChange("type", event.target.value)
                    }
                    className={selectClass}
                    aria-label="Filter by availability"
                >
                    <option value="available">Available</option>
                    <option value="issued">Issued</option>
                    <option value="all">All Devices</option>
                </select>

                {/* Archive status */}
                <select
                    // Archive
                    value={filter}
                    onChange={(event) =>
                        handleFilterChange("filter", event.target.value)
                    }
                    className={selectClass}
                    aria-label="Filter by archive status"
                >
                    <option value="1">Active</option>
                    <option value="2">Archived</option>
                </select>
            </div>

            <div className="mb-3 text-sm text-neutral-500">
                Showing {devices.length} of {totalCount} devices
            </div>

            <DataTable
                columns={tableColumns}
                rows={devices}
                rowKey="id"
                rowsPerPage={perPage}
                minWidth={1100}
                loading={loading}
                search
                searchValue={search}
                initialSearchValue={search}
                onSearch={handleSearch}
                searchDebounce={searchDebounce}
                searchPlaceholder="Search devices by category, code, serial number or brand..."
                pagination={{
                    page,
                    perPage,
                    total: totalCount,
                    onPageChange: (nextPage) =>
                        updateQueryParams({ page: nextPage }),
                }}
            />

            <DeleteConfirmationDialog
                open={Boolean(selectedDevice)}
                onClose={() => setSelectedDevice(null)}
                onConfirm={handleConfirmDelete}
                title="Archive Device?"
                itemName={selectedDevice?.device_code || ""}
                description={`Are you sure you want to archive device ${selectedDevice?.device_code || ""
                    }? This device will be removed from the active device listing.`}
                confirmLabel="Archive"
                loading={
                    selectedDevice
                        ? Boolean(deleting[selectedDevice.id])
                        : false
                }
            />
        </div>
    );
}
