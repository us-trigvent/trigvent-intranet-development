import { useState } from "react";
import { CheckCircle2, ListTodo, Send } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10";

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
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span>Trigvent</span>
          <span className="text-neutral-300">/</span>
          <span>Tasks</span>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-teal">Add Task</span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
            <ListTodo size={23} />
          </span>
          Add Task
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Record your work activity and assign it to a project.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">
        <div className="border-b border-border-default bg-surface-subtle/70 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
              <ListTodo size={20} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-brand-navy">Task Details</h2>
              <p className="mt-1 text-sm text-neutral-500">Enter the date, time and work description.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:p-7">
            <div>
              <label htmlFor="taskDate" className="mb-2 block text-sm font-medium text-text-secondary">
                Date <span className="ml-1 text-danger">*</span>
              </label>
              <input
                id="taskDate"
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                className={inputClass}
              />
              {errors.date && <p className="mt-1.5 text-xs text-danger">{errors.date}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Time <span className="ml-1 text-danger">*</span>
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
                  {errors.hours && <p className="mt-1.5 text-xs text-danger">{errors.hours}</p>}
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
                  {errors.minutes && <p className="mt-1.5 text-xs text-danger">{errors.minutes}</p>}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="project" className="mb-2 block text-sm font-medium text-text-secondary">
                Select Project <span className="ml-1 text-danger">*</span>
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
              {errors.project && <p className="mt-1.5 text-xs text-danger">{errors.project}</p>}
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-text-secondary">
                Task Description <span className="ml-1 text-danger">*</span>
              </label>
              <textarea
                id="description"
                rows={6}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Describe your task here..."
                className={`${inputClass} resize-y`}
              />
              {errors.description && <p className="mt-1.5 text-xs text-danger">{errors.description}</p>}
            </div>
          </div>

          {message && (
            <p role="status" className="mx-5 mb-5 flex items-center gap-2 rounded-xl border border-brand-teal-soft bg-brand-teal-soft px-4 py-3 text-sm font-medium text-brand-teal-dark sm:mx-7">
              <CheckCircle2 size={17} />
              {message}
            </p>
          )}

          <div className="flex justify-end border-t border-border-default px-5 py-4 sm:px-7">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-brand-teal/20"
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
