import { useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  FileSpreadsheet,
  UploadCloud,
  X,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#203D61] outline-none transition placeholder:text-slate-400 focus:border-[#0D9999] focus:ring-4 focus:ring-[#0D9999]/10 disabled:cursor-not-allowed disabled:bg-slate-100";

export default function UploadAttendance() {
  const fileInputRef = useRef(null);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const updateFile = (selectedFile) => {
    setErrors((current) => ({ ...current, file: "" }));
    setMessage("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedExtensions = /\.(csv|xlsx|xls)$/i;
    if (!allowedExtensions.test(selectedFile.name)) {
      setFile(null);
      setErrors({ file: "Please select a CSV or Excel file." });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setErrors({ file: "File size must be less than 10 MB." });
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!attendanceDate) {
      nextErrors.attendanceDate = "Please select an attendance date.";
    }
    if (!file) {
      nextErrors.file = "Please choose an attendance file.";
    }

    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length === 0) {
      setMessage(`${file.name} is ready to upload.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Trigvent</span>
          <span className="text-slate-300">/</span>
          <span>Attendance</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#0D9999]">Upload Attendance</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#203D61] sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
            <UploadCloud size={23} />
          </span>
          Upload Attendance
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Upload an attendance file for a selected date.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
              <FileSpreadsheet size={20} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#203D61]">
                Attendance File
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select the attendance date and upload your file.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(event) => {
                    setAttendanceDate(event.target.value);
                    setErrors((current) => ({ ...current, attendanceDate: "" }));
                    setMessage("");
                  }}
                  className={`${inputClass} pl-10`}
                />
              </div>
              {errors.attendanceDate && (
                <p className="mt-1.5 text-xs text-red-500">{errors.attendanceDate}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Choose File <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(event) => updateFile(event.target.files?.[0])}
                className="sr-only"
              />

              {file ? (
                <div className="flex min-h-10.5 items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50/50 px-3.5 py-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0D9999]">
                      <FileSpreadsheet size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#203D61]">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-red-500"
                    aria-label="Remove selected file"
                  >
                    <X size={17} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`${inputClass} flex min-h-10.5 items-center justify-center gap-2 border-dashed text-slate-500 hover:border-[#0D9999] hover:bg-teal-50/30`}
                >
                  <UploadCloud size={18} className="text-[#0D9999]" />
                  Choose file
                </button>
              )}

              {errors.file && (
                <p className="mt-1.5 text-xs text-red-500">{errors.file}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-7">
            {message && (
              <p className="mr-auto flex items-center gap-2 text-sm font-medium text-[#087F80]">
                <CheckCircle2 size={17} />
                {message}
              </p>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0D9999] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#087F80] focus:outline-none focus:ring-4 focus:ring-[#0D9999]/20"
            >
              <UploadCloud size={17} />
              Upload
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
