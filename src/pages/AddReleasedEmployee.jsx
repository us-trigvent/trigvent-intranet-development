
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, UserRoundPlus } from "lucide-react";

import Button from "../components/common/Button";
import LookupDropdown from "../components/common/LookupDropdown";
import { useToast } from "../components/ToastProvider";
import { fetchEmployees } from "../redux/actions/employeeActions";
import {
  createRelievement,
  fetchRelievementById,
  updateRelievement,
} from "../redux/actions/relievementActions";

const initialForm = {
  empId: "",
  resignationDate: "",
  serviceEndDate: "",
  leavingReason: "",
  mode: "",
  remarks: "",
};

const inputClass =
  "w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 disabled:cursor-not-allowed disabled:bg-surface-muted";

function FormField({
  label,
  required,
  error,
  children,
  className = "",
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label className="mb-2 block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}

const toDateInput = (value) => String(value || "").slice(0, 10);

export default function AddReleasedEmployee() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { relievementId } = useParams();
  const { showToast } = useToast();

  const isEditMode = Boolean(relievementId);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const {
    records: employeeRecords = [],
    loading: employeesLoading,
    error: employeesError,
  } = useSelector((state) => state.employees);

  const {
    creating,
    updating,
    detail,
    detailLoading,
    detailError,
  } = useSelector((state) => state.relievements);

  const isSubmitting = creating || updating;

  // Handle different possible API response structures
  const relievementDetail =
    detail?.data?.data ?? detail?.data ?? detail;

  // Fetch employees
  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, per_page: 100 }));
  }, [dispatch]);

  // Fetch selected relievement details in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchRelievementById(relievementId));
    }
  }, [dispatch, isEditMode, relievementId]);

  // Populate form when detail API response arrives
  useEffect(() => {
    if (!isEditMode || !relievementDetail) return;

    setForm({
      empId: String(
        relievementDetail.emp_id ??
          relievementDetail.employee_id ??
          relievementDetail.employee?.id ??
          ""
      ),

      resignationDate: toDateInput(
        relievementDetail.date_of_resignation ??
          relievementDetail.resignation_date
      ),

      serviceEndDate: toDateInput(
        relievementDetail.end_of_services ??
          relievementDetail.service_end_date
      ),

      leavingReason: String(
        relievementDetail.leaving_reason ??
          relievementDetail.reason ??
          ""
      ),

      mode: String(relievementDetail.mode ?? ""),

      remarks: String(relievementDetail.remarks ?? ""),
    });
  }, [relievementDetail, isEditMode]);

  // Prepare employee dropdown options
  const employeeOptions = useMemo(() => {
    const options = employeeRecords.map((employee) => {
      const name =
        employee.name ||
        employee.full_name ||
        employee.employee_name ||
        [
          employee.first_name,
          employee.last_name,
        ]
          .filter(Boolean)
          .join(" ") ||
        "Unnamed employee";

      const code =
        employee.employee_code || employee.code;

      return {
        id: String(employee.id),
        name: code ? `${name} — ${code}` : name,
      };
    });

    // Get selected employee details
    if (isEditMode && relievementDetail) {
      const employeeId = String(
        relievementDetail.emp_id ??
          relievementDetail.employee_id ??
          relievementDetail.employee?.id ??
          ""
      );

      const alreadyExists = options.some(
        (employee) => employee.id === employeeId
      );

      // Add selected employee if missing from employee list
      if (employeeId && !alreadyExists) {
        const employeeName =
          relievementDetail.employee_name ||
          relievementDetail.employee?.name ||
          relievementDetail.employee?.full_name ||
          "Selected Employee";

        const employeeCode =
          relievementDetail.employee_code ||
          relievementDetail.employee?.employee_code;

        options.unshift({
          id: employeeId,
          name: employeeCode
            ? `${employeeName} — ${employeeCode}`
            : employeeName,
        });
      }
    }

    return options;
  }, [
    employeeRecords,
    relievementDetail,
    isEditMode,
  ]);

  // Update form fields
  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  // Form validation
  const validate = () => {
    const nextErrors = {};

    const requiredFields = [
      ...(!isEditMode ? [["empId", "Employee"]] : []),
      ["resignationDate", "Resignation date"],
      ["serviceEndDate", "Service end date"],
      ["leavingReason", "Reason of leaving"],
      ["mode", "Mode"],
    ];

    requiredFields.forEach(([name, label]) => {
      if (!String(form[name] || "").trim()) {
        nextErrors[name] = `${label} is required.`;
      }
    });

    if (
      form.resignationDate &&
      form.serviceEndDate &&
      form.serviceEndDate < form.resignationDate
    ) {
      nextErrors.serviceEndDate =
        "Service end date cannot be before the resignation date.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const payload = {
      resignation_date: form.resignationDate,
      service_end_date: form.serviceEndDate,
      leaving_reason: form.leavingReason.trim(),
      mode: form.mode,
      remarks: form.remarks.trim(),
    };

    // Employee ID is required only when creating
    if (!isEditMode) {
      payload.emp_id = Number(form.empId);
    }

    try {
      const response = await dispatch(
        isEditMode
          ? updateRelievement({
              id: relievementId,
              data: payload,
            })
          : createRelievement(payload)
      ).unwrap();

      showToast({
        type: "success",
        title: isEditMode
          ? "Released employee updated"
          : "Released employee added",

        message:
          response?.message ||
          (isEditMode
            ? "The released employee record was updated."
            : "The released employee record was created."),
      });

      navigate("/hr/released-employees");
    } catch (error) {
      showToast({
        type: "error",
        title: isEditMode
          ? "Unable to update released employee"
          : "Unable to add released employee",

        message:
          typeof error === "string"
            ? error
            : "Please check the details and try again.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <header className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/hr/released-employees")}
          >
            <ArrowLeft size={16} />
            Released employees
          </Button>

          <p className="mt-5 text-xs font-medium text-neutral-500">
            Trigvent / Human Resources / Released Employees /
            {isEditMode ? " Edit" : " Add"}
          </p>

          <h1 className="mt-2 flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
              <UserRoundPlus size={23} />
            </span>

            {isEditMode
              ? "Edit Released Employee"
              : "Add Released Employee"}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Record an employee’s release, termination, or layoff details.
          </p>
        </header>

        {/* Form Section */}
        <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">

          {/* Detail loading / error */}
          {isEditMode && detailLoading && (
            <div className="flex items-center gap-2 px-5 py-4 text-sm text-neutral-500 sm:px-7">
              <LoaderCircle size={17} className="animate-spin" />
              Loading employee details...
            </div>
          )}

          {isEditMode && detailError && (
            <div className="m-5 flex items-center justify-between gap-3 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger sm:m-7">
              <p role="alert">{detailError}</p>

              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-danger/30 text-danger hover:bg-danger-soft"
                onClick={() =>
                  dispatch(fetchRelievementById(relievementId))
                }
              >
                Retry
              </Button>
            </div>
          )}

          <div className="border-b border-border-default bg-surface-subtle/70 px-5 py-4 sm:px-7">
            <h2 className="text-base font-semibold text-brand-navy">
              Release Information
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Enter the employee exit and service-end details.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">

              {/* Employee */}
              <FormField
                label="Select Employee"
                required={!isEditMode}
                error={errors.empId || employeesError}
              >
                <LookupDropdown
                  value={form.empId}
                  options={employeeOptions}
                  placeholder="Select Employee"
                  loading={employeesLoading}
                  disabled={
                    isEditMode || Boolean(employeesError)
                  }
                  onChange={(value) =>
                    updateField("empId", value)
                  }
                />
              </FormField>

              {/* Resignation Date */}
              <FormField
                label="Resignation Date"
                required
                error={errors.resignationDate}
              >
                <input
                  type="date"
                  value={form.resignationDate}
                  onChange={(event) =>
                    updateField(
                      "resignationDate",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </FormField>

              {/* Service End Date */}
              <FormField
                label="Service End Date"
                required
                error={errors.serviceEndDate}
              >
                <input
                  type="date"
                  value={form.serviceEndDate}
                  onChange={(event) =>
                    updateField(
                      "serviceEndDate",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </FormField>

              {/* Mode */}
              <FormField
                label="Mode"
                required
                error={errors.mode}
              >
                <select
                  value={form.mode}
                  onChange={(event) =>
                    updateField("mode", event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select Mode</option>
                  <option value="Release">Release</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Lay off">Lay off</option>
                </select>
              </FormField>

              {/* Reason */}
              <FormField
                label="Reason of Leaving"
                required
                error={errors.leavingReason}
                className="lg:col-span-2"
              >
                <textarea
                  value={form.leavingReason}
                  onChange={(event) =>
                    updateField(
                      "leavingReason",
                      event.target.value
                    )
                  }
                  placeholder="Enter reason"
                  rows={4}
                  className={`${inputClass} min-h-28 resize-y`}
                />
              </FormField>

              {/* Remarks */}
              <FormField
                label="Remarks"
                className="lg:col-span-2"
              >
                <textarea
                  value={form.remarks}
                  onChange={(event) =>
                    updateField("remarks", event.target.value)
                  }
                  placeholder="Enter remarks"
                  rows={4}
                  className={`${inputClass} min-h-28 resize-y`}
                />
              </FormField>
            </div>

            {/* Submit */}
            <div className="flex justify-end border-t border-border-light px-5 py-4 sm:px-7">
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  detailLoading ||
                  (isEditMode && !relievementDetail)
                }
              >
                {isSubmitting && (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                )}

                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                    ? "Update"
                    : "Add"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
