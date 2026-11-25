
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Button from "../components/common/Button";
import DataTable from "../components/common/DataTable";
import { fetchDeviceLogs } from "../redux/actions/deviceActions";
import { useToast } from "../components/ToastProvider";

const readPositiveInteger = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
};

export default function DeviceLogsListing() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { deviceId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { showToast } = useToast();

    const {
        logs = [],
        logsPagination,
        logsLoading,
        logsError,
    } = useSelector((state) => state.devices);

    const page = readPositiveInteger(searchParams.get("page"), 1);
    const perPage = readPositiveInteger(
        searchParams.get("per_page"),
        25
    );

    useEffect(() => {
        if (deviceId) {
            dispatch(
                fetchDeviceLogs({
                    deviceId,
                    page,
                    per_page: perPage,
                })
            );
        }
    }, [dispatch, deviceId, page, perPage]);

    useEffect(() => {
        if (logsError && !logsLoading) {
            showToast({
                type: "error",
                title: "Unable to Load Device Logs",
                message: logsError,
            });
        }
    }, [logsError, logsLoading, showToast]);

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

    const normalizedLogs = useMemo(
        () =>
            logs.map((log) => ({
                ...log,
                employeeName: log.user?.name || "—",
                device: log.device_id,
                action: log.action || "—",
                remarks: log.remarks || "—",
                logDate: formatDate(log.dated),
            })),
        [logs]
    );

    const currentPage = Number(
        logsPagination?.current_page ?? page
    );

    const currentPerPage = Number(
        logsPagination?.per_page ?? perPage
    );

    const totalCount = Number(
        logsPagination?.total ?? normalizedLogs.length
    );

    const columns = useMemo(
        () => [
            {
                field: "serialNumber",
                headerName: "Sr.no",
                cellSx: {
                    width: 75,
                    color: "#64748B",
                    fontWeight: 600,
                },
                render: (_, __, index) =>
                    (currentPage - 1) * currentPerPage + index + 1,
            },
            {
                field: "employeeName",
                headerName: "Employee Name",
                cellSx: { minWidth: 180 },
            },
            {
                field: "device",
                headerName: "Device",
                cellSx: { minWidth: 150 },
            },
            {
                field: "action",
                headerName: "Action",
                cellSx: { minWidth: 140 },
            },
            {
                field: "remarks",
                headerName: "Remarks",
                cellSx: { minWidth: 220 },
            },
            {
                field: "logDate",
                headerName: "Date",
                cellSx: { minWidth: 170 },
            },
        ],
        [currentPage, currentPerPage]
    );

    return (
        <main className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
            <header className="mb-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <span>Trigvent</span>
                    <span>/</span>
                    <span>IT Management</span>
                    <span>/</span>
                    <span>Devices</span>
                    <span>/</span>
                    <span className="text-brand-teal">Device Logs</span>
                </div>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
                            Device Logs
                        </h1>
                        <p className="mt-2 text-sm text-neutral-500">
                            View activity history for device ID: {deviceId}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="self-start"
                    >
                        <ArrowLeft size={17} />
                        Back to Devices
                    </Button>
                </div>
            </header>

            <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white p-5 shadow-sm sm:p-6">
                <DataTable
                    columns={columns}
                    rows={normalizedLogs}
                    rowKey="id"
                    rowsPerPage={currentPerPage}
                    minWidth={1000}
                    loading={logsLoading}
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
