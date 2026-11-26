
import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Pencil,
    RotateCcw,
    Trash2,
    History,
    Loader2,
    UserPlus,
    X,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import Button from "../common/Button";
import DataTable from "../common/DataTable";
import { useToast } from "../ToastProvider";

import {
    fetchDevices,
    deleteDevice,
    issueDevice,
    recoverDevice,
    fetchDeviceById,
    updateDevice,

} from "../../redux/actions/deviceActions";

import { fetchEmployees } from "../../redux/actions/employeeActions";

const DEFAULT_FILTERS = {
    category: "",
    employee: "",
    type: "all",
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
    const [editDevice, setEditDevice] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    const [editForm, setEditForm] = useState({
        category: "",
        device_code: "",
        serial_number: "",
        brand: "",
        condition: "Working",
        comments: "",
    });
    const readPositiveInteger = (value, fallback) => {
        const parsed = Number.parseInt(value, 10);
        return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
    };

    const category = searchParams.get("category") || "";
    const employee = searchParams.get("employee") || "";
    const type = searchParams.get("type") || "all";
    const filter = searchParams.get("filter") || "1";
    const search = searchParams.get("search") || "";
    const page = readPositiveInteger(searchParams.get("page"), 1);
    const perPage = readPositiveInteger(searchParams.get("per_page"), 25);
    const [actionDevice, setActionDevice] = useState(null);
    const [actionType, setActionType] = useState(null);

    const [actionForm, setActionForm] = useState({
        issued_to: "",
        issued_on: new Date().toLocaleDateString("en-CA"),
        remarks: "",
    });

    const {
        records: devices = [],
        loading,
        error,
        pagination,
        deleting = {},
        deviceActionLoading = {},
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
    const openDeviceAction = (device) => {
        const isIssued =
            Number(device.is_issued) === 1 || device.is_issued === true;

        setActionDevice(device);
        setActionType(isIssued ? "recover" : "issue");

        setActionForm({
            issued_to: "",
            issued_on: new Date().toLocaleDateString("en-CA"),
            remarks: "",
        });
    };
    const openEditDialog = async (device) => {
        setEditDevice(device);
        setEditLoading(true);

        try {
            const response = await dispatch(
                fetchDeviceById(device.id)
            ).unwrap();

            // Supports common API response structures
            const details =
                response?.data?.device ||
                response?.data?.data ||
                response?.data ||
                response?.device ||
                response;

            setEditForm({
                category: details.category || "",
                device_code: details.device_code || "",
                serial_number: details.serial_number || "",
                brand: details.brand || "",
                condition: details.condition || "Working",
                comments: details.comments || "",
            });
        } catch (error) {
            setEditDevice(null);

            showToast({
                type: "error",
                title: "Unable to Load Device",
                message:
                    typeof error === "string"
                        ? error
                        : "Failed to fetch device details.",
            });
        } finally {
            setEditLoading(false);
        }
    };

    const closeEditDialog = () => {
        if (updateLoading) return;

        setEditDevice(null);
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleUpdateDevice = async (event) => {
        event.preventDefault();

        if (!editDevice) return;

        const payload = {
            category: editForm.category,
            device_code: editForm.device_code.trim(),
            serial_number: editForm.serial_number.trim(),
            brand: editForm.brand.trim(),
            condition: editForm.condition,
            comments: editForm.comments.trim(),
        };

        setUpdateLoading(true);

        try {
            const response = await dispatch(
                updateDevice({
                    deviceId: editDevice.id,
                    payload,
                })
            ).unwrap();

            showToast({
                type: "success",
                title: "Device Updated",
                message: response?.message || "Device updated successfully.",
            });

            setEditDevice(null);

            // Refresh the listing with the current filters and pagination
            dispatch(fetchDevices(query));
        } catch (error) {
            showToast({
                type: "error",
                title: "Update Failed",
                message:
                    typeof error === "string"
                        ? error
                        : "Failed to update device.",
            });
        } finally {
            setUpdateLoading(false);
        }
    };
    const closeDeviceAction = () => {
        if (actionDevice && deviceActionLoading[actionDevice.id]) return;

        setActionDevice(null);
        setActionType(null);
    };


    const handleDeviceAction = async (event) => {
        event.preventDefault();

        if (!actionDevice || !actionType) return;

        const payload = {
            remarks: actionForm.remarks.trim(),
        };

        if (actionType === "issue") {
            if (!actionForm.issued_to || !actionForm.issued_on) {
                showToast({
                    type: "warning",
                    title: "Missing Details",
                    message: "Please select an employee and issue date.",
                });
                return;
            }

            payload.issued_to = Number(actionForm.issued_to);
            payload.issued_on = actionForm.issued_on;
        }

        console.log("Device Action:", actionType);
        console.log("Device ID:", actionDevice.id);
        console.log("Request Payload:", payload);

        try {
            const action =
                actionType === "issue" ? issueDevice : recoverDevice;

            const result = await dispatch(
                action({
                    deviceId: actionDevice.id,
                    payload,
                })
            ).unwrap();

            console.log("API Success:", result);

            showToast({
                type: "success",
                title: actionType === "issue" ? "Device Issued" : "Device Recovered",
                message: result?.message || "Action completed successfully.",
            });

            setActionDevice(null);
            setActionType(null);

            dispatch(fetchDevices(query));
        } catch (error) {
            console.error("Device Action Error:", error);

            showToast({
                type: "error",
                title: actionType === "issue" ? "Issue Failed" : "Recovery Failed",
                message:
                    typeof error === "string"
                        ? error
                        : error?.message || "Check browser console for the actual error.",
            });
        }
    };

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
                                onClick={() => openEditDialog(device)}
                                title="Edit device"
                                aria-label="Edit device"
                                className="text-info hover:bg-info-soft"
                            >
                                <Pencil size={15} />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openDeviceAction(device)}
                                disabled={Boolean(deviceActionLoading[device.id])}
                                title={isIssued ? "Recover device" : "Issue device"}
                                aria-label={isIssued ? "Recover device" : "Issue device"}
                                className={
                                    isIssued
                                        ? "text-warning-dark hover:bg-warning-soft"
                                        : "text-success hover:bg-success/10"
                                }
                            >
                                {deviceActionLoading[device.id] ? (
                                    <Loader2 size={15} className="animate-spin" />
                                ) : isIssued ? (
                                    <RotateCcw size={15} />
                                ) : (
                                    <UserPlus size={15} />
                                )}
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

            {actionDevice && (
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-dark/50 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="device-action-title"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !deviceActionLoading[actionDevice.id]
                        ) {
                            closeDeviceAction();
                        }
                    }}
                >
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
                        <div className="border-b border-border-default px-6 py-5">
                            <h2
                                id="device-action-title"
                                className="text-lg font-semibold text-brand-navy"
                            >
                                {actionType === "issue" ? "Issue Device" : "Recover Device"}
                            </h2>

                            <p className="mt-1 text-sm text-neutral-500">
                                Device: {actionDevice.device_code}
                            </p>
                        </div>

                        <form onSubmit={handleDeviceAction} className="p-6">
                            {actionType === "issue" && (
                                <>
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-neutral-600">
                                            Select Employee <span className="text-danger">*</span>
                                        </label>

                                        <select
                                            value={actionForm.issued_to}
                                            onChange={(event) =>
                                                setActionForm((previous) => ({
                                                    ...previous,
                                                    issued_to: event.target.value,
                                                }))
                                            }
                                            required
                                            className={selectClass}
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
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-neutral-600">
                                            Issued On <span className="text-danger">*</span>
                                        </label>

                                        <input
                                            type="date"
                                            value={actionForm.issued_on}
                                            onChange={(event) =>
                                                setActionForm((previous) => ({
                                                    ...previous,
                                                    issued_on: event.target.value,
                                                }))
                                            }
                                            required
                                            className={selectClass}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-medium text-neutral-600">
                                    Remarks
                                </label>

                                <textarea
                                    rows={3}
                                    value={actionForm.remarks}
                                    onChange={(event) =>
                                        setActionForm((previous) => ({
                                            ...previous,
                                            remarks: event.target.value,
                                        }))
                                    }
                                    placeholder={
                                        actionType === "issue"
                                            ? "Enter issue remarks..."
                                            : "Enter recovery remarks..."
                                    }
                                    className="w-full rounded-lg border border-border-default bg-white px-3 py-2 text-sm text-brand-navy outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeDeviceAction}
                                    disabled={Boolean(deviceActionLoading[actionDevice.id])}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="default"
                                    disabled={
                                        Boolean(deviceActionLoading[actionDevice.id]) ||
                                        (actionType === "issue" &&
                                            (!actionForm.issued_to || !actionForm.issued_on))
                                    }
                                >
                                    {deviceActionLoading[actionDevice.id] && (
                                        <Loader2 size={16} className="animate-spin" />
                                    )}

                                    {actionType === "issue" ? "Issue Device" : "Recover Device"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editDevice && (
                <div
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-brand-navy/50 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="update-device-title"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !updateLoading
                        ) {
                            closeEditDialog();
                        }
                    }}
                >
                    <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-border-default bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border-default bg-brand-teal px-5 py-4">
                            <div>
                                <h2
                                    id="update-device-title"
                                    className="text-lg font-semibold uppercase tracking-wide text-white"
                                >
                                    Update Device
                                </h2>
                                <p className="mt-0.5 text-xs text-white/80">
                                    Update device information and details
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditDialog}
                                disabled={updateLoading}
                                aria-label="Close dialog"
                                className="rounded-md p-1.5 text-white transition hover:bg-white/15 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {editLoading ? (
                            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
                                <Loader2
                                    size={30}
                                    className="animate-spin text-brand-teal"
                                />
                                <p className="text-sm text-neutral-500">
                                    Loading device details...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateDevice}>
                                <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">

                                    {/* Category */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-brand-navy">
                                            Category <span className="text-danger">*</span>
                                        </label>

                                        <select
                                            name="category"
                                            value={editForm.category}
                                            onChange={handleEditFormChange}
                                            required
                                            className={selectClass}
                                        >
                                            <option value="">Select Category</option>
                                            {[...new Set(
                                                [...categories, editForm.category].filter(Boolean)
                                            )].map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Device Code */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-brand-navy">
                                            Device Code
                                        </label>

                                        <input
                                            type="text"
                                            name="device_code"
                                            value={editForm.device_code}
                                            onChange={handleEditFormChange}
                                            className={selectClass}
                                            placeholder="Enter device code"
                                        />
                                    </div>

                                    {/* Serial Number */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-brand-navy">
                                            Serial Number <span className="text-danger">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="serial_number"
                                            value={editForm.serial_number}
                                            onChange={handleEditFormChange}
                                            required
                                            className={selectClass}
                                            placeholder="Enter serial number"
                                        />
                                    </div>

                                    {/* Brand */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-brand-navy">
                                            Brand <span className="text-danger">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="brand"
                                            value={editForm.brand}
                                            onChange={handleEditFormChange}
                                            required
                                            className={selectClass}
                                            placeholder="Enter brand"
                                        />
                                    </div>

                                    {/* Condition */}
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-brand-navy">
                                            Condition <span className="text-danger">*</span>
                                        </label>

                                        <div className="flex flex-wrap items-center gap-6">
                                            {["Working", "Faulted"].map((condition) => (
                                                <label
                                                    key={condition}
                                                    className="flex cursor-pointer items-center gap-2 text-sm text-brand-navy"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="condition"
                                                        value={condition}
                                                        checked={editForm.condition === condition}
                                                        onChange={handleEditFormChange}
                                                        className="h-4 w-4 accent-brand-teal"
                                                    />
                                                    {condition}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comments */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-brand-navy">
                                            Comments
                                        </label>

                                        <textarea
                                            name="comments"
                                            rows={3}
                                            value={editForm.comments}
                                            onChange={handleEditFormChange}
                                            placeholder="Enter comments..."
                                            className="w-full rounded-md border border-border-default bg-white px-3 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10"
                                        />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-end gap-3 border-t border-border-default bg-surface-muted px-6 py-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeEditDialog}
                                        disabled={updateLoading}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="default"
                                        disabled={updateLoading}
                                    >
                                        {updateLoading ? (
                                            <>
                                                <Loader2
                                                    size={16}
                                                    className="mr-2 animate-spin"
                                                />
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Device"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
