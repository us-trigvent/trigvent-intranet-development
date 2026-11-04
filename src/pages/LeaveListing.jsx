import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Clock3, Plus, UsersRound } from "lucide-react";
import DataTable from "../components/common/DataTable";

const leaveRecords = [
  { id: 1, employee: "Rahul Gupta", leaveType: "Casual Leave", leaveTypeShort: "CL", fromDate: "29-10-2026", toDate: "30-10-2026", days: 2, status: "Approved", reason: "Personal work" },
  { id: 2, employee: "Priya Sharma", leaveType: "Sick Leave", leaveTypeShort: "SL", fromDate: "28-10-2026", toDate: "28-10-2026", days: 1, status: "Pending", reason: "Medical appointment" },
  { id: 3, employee: "Harpreet Singh", leaveType: "Earned Leave", leaveTypeShort: "EL", fromDate: "01-11-2026", toDate: "05-11-2026", days: 5, status: "Approved", reason: "Family vacation" },
  { id: 4, employee: "Amit Kumar", leaveType: "Compensatory Off", leaveTypeShort: "CO", fromDate: "27-10-2026", toDate: "27-10-2026", days: 1, status: "Rejected", reason: "Comp off adjustment" },
];

const statusStyles = {
  Approved: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Rejected: "bg-rose-50 text-rose-700",
};

export default function LeaveListing() {
  const navigate = useNavigate();
  const [leaveType, setLeaveType] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredRecords = useMemo(
    () => leaveRecords.filter((record) =>
      (leaveType === "All" || record.leaveType === leaveType) &&
      (status === "All" || record.status === status)
    ),
    [leaveType, status]
  );

  const columns = useMemo(() => [
    {
      field: "employee",
      headerName: "Employee",
      render: (value, row) => (
        <div>
          <p className="font-semibold text-[#203D61]">{value}</p>
          <p className="mt-0.5 text-xs text-slate-500">{row.leaveTypeShort}</p>
        </div>
      ),
    },
    { field: "leaveType", headerName: "Leave Type" },
    { field: "fromDate", headerName: "From Date" },
    { field: "toDate", headerName: "To Date" },
    { field: "days", headerName: "Days", align: "center" },
    { field: "reason", headerName: "Reason" },
    {
      field: "status",
      headerName: "Status",
      align: "center",
      render: (value) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[value] || "bg-slate-100 text-slate-700"}`}>
          {value}
        </span>
      ),
    },
  ], []);

  const approvedCount = leaveRecords.filter((record) => record.status === "Approved").length;
  const pendingCount = leaveRecords.filter((record) => record.status === "Pending").length;

  return (
    <main className="min-h-screen bg-[#F5F8FC] px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
        <span>Trigvent</span><span className="text-slate-300">/</span>
        <span>Leave Management</span><span className="text-slate-300">/</span>
        <span className="text-[#0D9999]">Leaves Listing</span>
      </div>

      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#203D61] sm:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
              <CalendarCheck size={23} />
            </span>
            Leave Listing
          </h1>
          <p className="mt-2 text-sm text-slate-500">View and manage employee leave applications.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/leaves/add")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D9999] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#087F80]"
        >
          <Plus size={18} /> Add Leave
        </button>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Requests", value: leaveRecords.length, icon: UsersRound, tone: "bg-blue-50 text-blue-600" },
          { label: "Approved", value: approvedCount, icon: CalendarCheck, tone: "bg-emerald-50 text-emerald-600" },
          { label: "Pending", value: pendingCount, icon: Clock3, tone: "bg-amber-50 text-amber-600" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-[#203D61]">{value}</p></div>
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon size={21} /></span>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold text-[#203D61]">Leave Records</h2>
          <p className="mt-1 text-sm text-slate-500">Search and filter leave applications.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select value={leaveType} onChange={(event) => setLeaveType(event.target.value)} aria-label="Filter by leave type" className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none focus:border-[#0D9999]">
              <option value="All">All Leave Types</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Compensatory Off">Compensatory Off</option>
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status" className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none focus:border-[#0D9999]">
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <DataTable columns={columns} rows={filteredRecords} rowKey="id" rowsPerPage={10} showSearch searchPlaceholder="Search leave records..." />
        </div>
      </section>
    </main>
  );
}
