
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";

import {
  Monitor,
  Plus,
  Loader2,
} from "lucide-react";


import { deviceValidationSchema } from "../validations/deviceValidation";
import { createDevice } from "../redux/actions/deviceActions";
import { fetchEmployees } from "../redux/actions/employeeActions";
import Button from "../components/common/Button";
import { useToast } from "../components/ToastProvider";

const inputClass =
  "w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10";

const initialValues = {
  category: "Desktop",
  serialNumber: "",
  deviceCode: "",
  brand: "",
  condition: "Faulted",
  issued: "No",
  issuedTo: "",
  issuedOn: "",
  remarks: "",
  comments: "",
};

const Field = ({
  label,
  name,
  required = false,
  error,
  children,
}) => (
  <div>
    <label
      htmlFor={name}
      className="mb-2 block text-sm font-medium text-text-secondary"
    >
      {label}
      {required && <span className="ml-1 text-danger">*</span>}
    </label>

    {children}

    {error && (
      <p className="mt-1.5 text-xs text-danger">
        {error}
      </p>
    )}
  </div>
);

const RadioGroup = ({
  label,
  name,
  options,
  formik,
}) => (
  <fieldset>
    <legend className="mb-2 text-sm font-medium text-text-secondary">
      {label} <span className="text-danger">*</span>
    </legend>

    <div className="flex min-h-10.5 flex-wrap items-center gap-5">
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary"
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={formik.values[name] === option}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="h-4 w-4 accent-brand-teal"
          />

          {option}
        </label>
      ))}
    </div>

    {formik.touched[name] && formik.errors[name] && (
      <p className="mt-1.5 text-xs text-danger">
        {formik.errors[name]}
      </p>
    )}
  </fieldset>
);

export default function AddDevice() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Device Redux State
  const { creating } = useSelector(
    (state) => state.devices
  );

  // Employee Redux State
  const {
    records: employees,
    loading: employeesLoading,
  } = useSelector((state) => state.employees);

  // Fetch Employees
  useEffect(() => {
    if (!employees.length && !employeesLoading) {
      dispatch(fetchEmployees({}));
    }
  }, [dispatch]);

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema: deviceValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      const payload = {
        category: values.category,
        serial_number: values.serialNumber.trim(),
        brand: values.brand.trim(),
        condition: values.condition,
        is_issued: values.issued === "Yes" ? 1 : 0,
        remarks: values.remarks.trim(),
        comments: values.comments.trim(),
      };

      // Optional Device Code
      if (values.deviceCode.trim()) {
        payload.device_code = values.deviceCode.trim();
      }

      // Issued Device Details
      if (values.issued === "Yes") {
        payload.issued_to = Number(values.issuedTo);
        payload.issued_on = values.issuedOn;
      }

      try {
        const response = await dispatch(
          createDevice(payload)
        ).unwrap();

        showToast({
          type: "success",
          title: "Device Added",
          message:
            response?.message ||
            "Device has been added successfully.",
        });

        resetForm();
      } catch (error) {
        console.error("Create device error:", error);

        showToast({
          type: "error",
          title: "Failed to Add Device",
          message:
            typeof error === "string"
              ? error
              : "Something went wrong while adding the device.",
        });
      }
    },
  });

  // Handle Field Changes
  const handleChange = (event) => {
    formik.handleChange(event);
  };

  // Handle Issued Status
  const handleIssuedChange = (event) => {
    const { value } = event.target;

    handleChange(event);

    if (value === "No") {
      formik.setFieldValue("issuedTo", "");
      formik.setFieldValue("issuedOn", "");

      formik.setFieldTouched("issuedTo", false);
      formik.setFieldTouched("issuedOn", false);
    }
  };

  return (
    <div className="min-h-screen bg-page px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">

      {/* Header */}
      <header className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span>Trigvent</span>
          <span className="text-neutral-300">/</span>
          <span>IT Management</span>
          <span className="text-neutral-300">/</span>
          <span className="text-brand-teal">
            Add Device
          </span>
        </div>

        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-teal-soft text-brand-teal">
            <Monitor size={23} />
          </span>

          Add Device
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Enter device details for the IT inventory.
        </p>
      </header>

      {/* Form Section */}
      <section className="overflow-hidden rounded-2xl border border-border-default/80 bg-white shadow-sm">

        <form
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:p-6 lg:grid-cols-2 lg:p-7">

            {/* Category */}
            <Field
              label="Category"
              name="category"
              required
              error={
                formik.touched.category &&
                formik.errors.category
              }
            >
              <select
                {...formik.getFieldProps("category")}
                id="category"
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Desktop">Desktop</option>
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor</option>
                <option value="Mobile">Mobile</option>
                <option value="Tablet">Tablet</option>
                <option value="Printer">Printer</option>
                <option value="Accessory">Accessory</option>
              </select>
            </Field>

            {/* Serial Number */}
            <Field
              label="Serial Number"
              name="serialNumber"
              required
              error={
                formik.touched.serialNumber &&
                formik.errors.serialNumber
              }
            >
              <input
                {...formik.getFieldProps("serialNumber")}
                id="serialNumber"
                onChange={handleChange}
                placeholder="Enter serial number"
                className={inputClass}
              />
            </Field>

            {/* Device Code */}
            <Field
              label="Device Code"
              name="deviceCode"
              error={
                formik.touched.deviceCode &&
                formik.errors.deviceCode
              }
            >
              <input
                {...formik.getFieldProps("deviceCode")}
                id="deviceCode"
                onChange={handleChange}
                placeholder="Enter device code"
                className={inputClass}
              />
            </Field>

            {/* Brand */}
            <Field
              label="Brand"
              name="brand"
              required
              error={
                formik.touched.brand &&
                formik.errors.brand
              }
            >
              <input
                {...formik.getFieldProps("brand")}
                id="brand"
                onChange={handleChange}
                placeholder="Enter brand"
                className={inputClass}
              />
            </Field>

            {/* Condition */}
            <RadioGroup
              label="Condition"
              name="condition"
              options={["Working", "Faulted"]}
              formik={formik}
            />

            {/* Issued Status */}
            <RadioGroup
              label="Is Issued?"
              name="issued"
              options={["No", "Yes"]}
              formik={{
                ...formik,
                handleChange: handleIssuedChange,
              }}
            />

            {/* Issued To & Issued On */}
            {formik.values.issued === "Yes" && (
              <>
                {/* Employee Dropdown */}
                <Field
                  label="Issued To"
                  name="issuedTo"
                  required
                  error={
                    formik.touched.issuedTo &&
                    formik.errors.issuedTo
                  }
                >
                  <select
                    id="issuedTo"
                    name="issuedTo"
                    value={formik.values.issuedTo}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass}
                    disabled={employeesLoading}
                  >
                    <option value="">
                      {employeesLoading
                        ? "Loading employees..."
                        : "Select Employee"}
                    </option>

                    {employees.map((employee) => (
                      <option
                        key={employee.id}
                        value={employee.id}
                      >
                        {employee.employee_name || employee.name}
                        {employee.employee_code
                          ? ` (${employee.employee_code})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Issued Date */}
                <Field
                  label="Issued On"
                  name="issuedOn"
                  required
                  error={
                    formik.touched.issuedOn &&
                    formik.errors.issuedOn
                  }
                >
                  <input
                    type="date"
                    id="issuedOn"
                    name="issuedOn"
                    value={formik.values.issuedOn}
                    onChange={handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass}
                  />
                </Field>
              </>
            )}

            {/* Remarks */}
            <Field
              label="Remarks"
              name="remarks"
              error={
                formik.touched.remarks &&
                formik.errors.remarks
              }
            >
              <textarea
                {...formik.getFieldProps("remarks")}
                id="remarks"
                onChange={handleChange}
                placeholder="Enter device remarks"
                rows={3}
                className={inputClass}
              />
            </Field>

            {/* Comments */}
            <Field
              label="Comments"
              name="comments"
              error={
                formik.touched.comments &&
                formik.errors.comments
              }
            >
              <textarea
                {...formik.getFieldProps("comments")}
                id="comments"
                onChange={handleChange}
                placeholder="Enter additional device information"
                rows={3}
                className={inputClass}
              />
            </Field>

          </div>

          {/* Submit Button */}
          <div className="flex justify-center border-t border-border-default px-5 py-4 sm:px-7">

            <Button
              type="submit"
              disabled={creating || formik.isSubmitting}
              className="min-w-36"
            >
              {creating ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Adding Device...
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add Device
                </>
              )}
            </Button>

          </div>
        </form>
      </section>
    </div>
  );
}
