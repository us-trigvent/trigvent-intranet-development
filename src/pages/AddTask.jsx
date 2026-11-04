import { useState } from "react";
import { CheckCircle2, ListTodo, Send } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#203D61] outline-none transition placeholder:text-slate-400 focus:border-[#0D9999] focus:ring-4 focus:ring-[#0D9999]/10";

const getLocalDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().split("T")[0];
};

const projects = [
  "Website Redesign",
  "Mobile Application",
  "CRM Integration",
  "Internal Portal",
];

export default function AddTask() {
  const [form, setForm] = useState({
    date: getLocalDate(),
    hours: "",
    minutes: "",
    project: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.date) nextErrors.date = "Please select a date.";
    if (!form.hours) nextErrors.hours = "Please select hours.";
    if (!form.minutes) nextErrors.minutes = "Please select minutes.";
    if (!form.project) nextErrors.project = "Please select a project.";
    if (!form.description.trim()) nextErrors.description = "Please enter a task description.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setMessage("Task added successfully.");
    } else {
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Trigvent</span>
          <span className="text-slate-300">/</span>
          <span>Tasks</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#0D9999]">Add Task</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#203D61] sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
            <ListTodo size={23} />
          </span>
          Add Task
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Record your work activity and assign it to a project.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
              <ListTodo size={20} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#203D61]">Task Details</h2>
              <p className="mt-1 text-sm text-slate-500">Enter the date, time and work description.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:p-7">
            <div>
              <label htmlFor="taskDate" className="mb-2 block text-sm font-medium text-slate-700">
                Date <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                id="taskDate"
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                className={inputClass}
              />
              {errors.date && <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Time <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <select
                    aria-label="Hours"
                    value={form.hours}
                    onChange={(event) => updateField("hours", event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Hours</option>
                    {Array.from({ length: 24 }, (_, hour) => (
                      <option key={hour} value={hour}>{String(hour).padStart(2, "0")}</option>
                    ))}
                  </select>
                  {errors.hours && <p className="mt-1.5 text-xs text-red-500">{errors.hours}</p>}
                </div>
                <div>
                  <select
                    aria-label="Minutes"
                    value={form.minutes}
                    onChange={(event) => updateField("minutes", event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Minutes</option>
                    {[0, 15, 30, 45].map((minute) => (
                      <option key={minute} value={minute}>{String(minute).padStart(2, "0")}</option>
                    ))}
                  </select>
                  {errors.minutes && <p className="mt-1.5 text-xs text-red-500">{errors.minutes}</p>}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="project" className="mb-2 block text-sm font-medium text-slate-700">
                Select Project <span className="ml-1 text-red-500">*</span>
              </label>
              <select
                id="project"
                value={form.project}
                onChange={(event) => updateField("project", event.target.value)}
                className={inputClass}
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
              {errors.project && <p className="mt-1.5 text-xs text-red-500">{errors.project}</p>}
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                Task Description <span className="ml-1 text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={6}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Describe your task here..."
                className={`${inputClass} resize-y`}
              />
              {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
            </div>
          </div>

          {message && (
            <p role="status" className="mx-5 mb-5 flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800 sm:mx-7">
              <CheckCircle2 size={17} />
              {message}
            </p>
          )}

          <div className="flex justify-end border-t border-slate-200 px-5 py-4 sm:px-7">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0D9999] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#087F80] focus:outline-none focus:ring-4 focus:ring-[#0D9999]/20"
            >
              <Send size={17} />
              Add Task
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
