import {
  CalendarDays,
  CircleCheck,
  NotebookPen,
  X,
} from "lucide-react";
import FormField from "../FormField";
import FormSection from "../FormSection";

export default function NotesReviewStep({
  field,
  form,
  addNote,
  updateNote,
  removeNote,
  departments,
  designations,
}) {
  return (
    <>
      <FormSection
        title="Education and Experience"
        description="Optional education, interview and previous experience details."
        icon={CalendarDays}
        columns={2}
      >
        <FormField
          label="College"
          placeholder="Enter college or institution"
          {...field("college")}
        />
        <FormField
          label="Qualification"
          placeholder="Enter qualification"
          {...field("qualification")}
        />
        <FormField
          label="Interview Date"
          type="datetime-local"
          {...field("interviewDate")}
        />
        <FormField
          label="Passout Year"
          type="text"
          placeholder="YYYY"
          max="9999"
          {...field("passoutYear")}
        />
        <FormField
          label="Pursuing Year"
          type="text"
          placeholder="YYYY"
          max="9999"
          {...field("pursuingYear")}
        />
        <FormField
          label="Previous Experience"
          type="textarea"
          placeholder="Describe relevant experience"
          rows={2}
          {...field("previousExperience")}
        />
      </FormSection>

      <FormSection
        title="Additional Notes"
        description="Add internal notes relevant to this employee's record."
        icon={NotebookPen}
        columns={1}
      >
        <div className="space-y-3">
          {form.notes.map((note, index) => (
            <div key={index} className="flex items-start gap-3">
              <textarea
                value={note}
                onChange={(event) => updateNote(index, event.target.value)}
                rows={3}
                placeholder={`Enter note ${index + 1}...`}
                aria-label={`Employee note ${index + 1}`}
                className="min-w-0 flex-1 resize-y
                  rounded-xl border border-border-default
                  px-4 py-3 text-sm text-text-secondary
                  outline-none transition placeholder:text-neutral-400
                  focus:border-brand-teal focus:ring-4
                  focus:ring-brand-teal/10"
              />

              {form.notes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeNote(index)}
                  aria-label={`Remove note ${index + 1}`}
                  className="mt-2 rounded-lg p-2
                    text-neutral-400 transition
                    hover:bg-danger-soft hover:text-danger"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addNote}
            className="inline-flex items-center gap-2
              rounded-lg px-3 py-2 text-sm font-semibold
              text-brand-teal-dark transition hover:bg-brand-teal-soft"
          >
            <span className="text-lg leading-none">+</span>
            Add another note
          </button>
        </div>
      </FormSection>

      <FormSection
        title="Review Employee Details"
        description="Check the information before submitting the employee record."
        icon={CircleCheck}
        columns={2}
      >
        {[
          ["Employee name", `${form.firstName} ${form.lastName}`.trim()],
          ["Employee code", form.employeeCode],
          [
            "Department",
            departments.records.find((item) => item.id === form.department)
              ?.name || form.department,
          ],
          [
            "Designation",
            designations.records.find((item) => item.id === form.designation)
              ?.name || form.designation,
          ],
          ["Official email", form.officialEmail],
          ["Login email", form.loginEmail],
          ["Joining date", form.joiningDate],
          ["Branch", form.branch],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-border-light
              bg-surface-subtle/80 p-4"
          >
            <p className="text-xs font-medium text-neutral-500">{label}</p>
            <p className="mt-1.5 break-words text-sm
              font-semibold text-brand-navy"
            >
              {value || "Not provided"}
            </p>
          </div>
        ))}

        <div className="rounded-xl bg-warning-soft p-4 md:col-span-2">
          <p className="text-sm font-semibold text-warning-dark">
            Before submitting
          </p>
          <p className="mt-1 text-sm leading-6 text-warning-dark">
            Confirm that the information is accurate and that sensitive
            employee details will be handled securely.
          </p>
        </div>
      </FormSection>
    </>
  );
}
