import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  ShieldCheck,
} from "lucide-react";

import { useToast } from "../components/ToastProvider";
import BankDetailsStep from "../components/employee-form/add-employee/BankDetailsStep";
import LoginDetailsStep from "../components/employee-form/add-employee/LoginDetailsStep";
import NotesReviewStep from "../components/employee-form/add-employee/NotesReviewStep";
import PersonalDetailsStep from "../components/employee-form/add-employee/PersonalDetailsStep";
import StepNavigation from "../components/employee-form/add-employee/StepNavigation";
import {
  employeeSteps,
  initialEmployeeForm,
} from "../components/employee-form/add-employee/employeeFormConfig";
import {
  employeeStepSchemas,
  employeeValidationSchema,
  getValidationErrors,
} from "../components/employee-form/add-employee/employeeValidation";
import { buildEmployeeFormData } from "../components/employee-form/add-employee/employeePayload";
import {
  createEmployee,
  fetchNextEmployeeCode,
} from "../redux/actions/employeeActions";
import {
  fetchCities,
  fetchDepartments,
  fetchDesignations,
  fetchStates,
} from "../redux/actions/lookupActions";
import {
  clearCities,
  clearDesignations,
} from "../redux/slices/lookupSlice";
import { clearNextEmployeeCodeError } from "../redux/slices/employeeSlice";

export default function AddEmployee() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [reviewOpen, setReviewOpen] = useState(false);
  const creating = useSelector((state) => state.employees.creating);
  const nextEmployeeCodeLoading = useSelector(
    (state) => state.employees.nextEmployeeCodeLoading
  );
  const nextEmployeeCodeError = useSelector(
    (state) => state.employees.nextEmployeeCodeError
  );
  const { states, departments, designations, cities } = useSelector(
    (state) => state.lookups
  );

  const handleSubmit = async (values) => {
    try {
      await dispatch(createEmployee(buildEmployeeFormData(values))).unwrap();
      setReviewOpen(false);
      showToast({
        type: "success",
        title: "Employee created",
        message: "The employee record was created successfully.",
      });
      navigate("/hr/employee-listing");
    } catch (error) {
      showToast({
        type: "error",
        title: "Unable to create employee",
        message:
          typeof error === "string"
            ? error
            : "Please check the employee details and try again.",
      });
    }
  };

  return (
    <Formik
      initialValues={initialEmployeeForm}
      validationSchema={employeeValidationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <EmployeeFormContent
          formik={formik}
          navigate={navigate}
          dispatch={dispatch}
          reviewOpen={reviewOpen}
          setReviewOpen={setReviewOpen}
          creating={creating}
          nextEmployeeCodeLoading={nextEmployeeCodeLoading}
          nextEmployeeCodeError={nextEmployeeCodeError}
          states={states}
          departments={departments}
          designations={designations}
          cities={cities}
        />
      )}
    </Formik>
  );
}

function EmployeeFormContent({
  formik,
  navigate,
  dispatch,
  reviewOpen,
  setReviewOpen,
  creating,
  nextEmployeeCodeLoading,
  nextEmployeeCodeError,
  states,
  departments,
  designations,
  cities,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const form = formik.values;
  const errors = formik.errors;

  const getNextEmployeeCode = async () => {
    const result = await dispatch(fetchNextEmployeeCode());
    if (fetchNextEmployeeCode.fulfilled.match(result)) {
      formik.setFieldValue("employeeCode", result.payload);
    }
  };

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchStates());
  }, [dispatch]);

  useEffect(() => {
    if (!form.department) return undefined;

    dispatch(fetchDesignations({ departmentId: form.department }));
  }, [dispatch, form.department]);

  useEffect(() => {
    if (!form.stateId) return undefined;

    dispatch(fetchCities({ stateId: form.stateId }));
    return undefined;
  }, [dispatch, form.stateId]);

  const updateField = (event) => {
    const { name, value, files } = event.target;
    if (name === "department" && value !== form.department) {
      formik.setFieldValue("designation", "");
      dispatch(clearDesignations());
    }
    if (name === "employeeCode") {
      dispatch(clearNextEmployeeCodeError());
    }
    formik.setFieldValue(name, files ? files[0] || null : value);
  };

  const updateState = (event) => {
    const stateId = event.target.value;
    const selectedState = states.records.find(
      (option) => option.id === stateId
    );

    formik.setFieldValue("stateId", stateId);
    formik.setFieldValue("state", selectedState?.name || "");
    formik.setFieldValue("city", "");
    dispatch(clearCities());
  };

  const field = (name) => ({
    name,
    value: form[name],
    onChange: updateField,
    error: errors[name],
    onBlur: formik.handleBlur,
  });

  const goToStep = async (nextStep) => {
    if (nextStep < 0 || nextStep >= employeeSteps.length) return;

    if (nextStep > activeStep) {
      const nextErrors = await getValidationErrors(
        employeeStepSchemas[activeStep],
        form
      );
      formik.setErrors({ ...formik.errors, ...nextErrors });

      if (Object.keys(nextErrors).length > 0) return;
    }

    setActiveStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addNote = () => {
    formik.setFieldValue("notes", [...form.notes, ""]);
  };

  const updateNote = (index, value) => {
    formik.setFieldValue(
      "notes",
      form.notes.map((note, noteIndex) =>
        noteIndex === index ? value : note
      )
    );
  };

  const removeNote = (index) => {
    formik.setFieldValue(
      "notes",
      form.notes.filter((_, noteIndex) => noteIndex !== index)
    );
  };

  const confirmSubmit = async () => {
    const allErrors = await getValidationErrors(employeeValidationSchema, form);
    formik.setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      const stepErrors = await Promise.all(
        employeeStepSchemas.map((schema) => getValidationErrors(schema, form))
      );
      const firstInvalidStep = stepErrors.findIndex(
        (stepError) => Object.keys(stepError).length > 0
      );

      setActiveStep(firstInvalidStep === -1 ? 0 : firstInvalidStep);
      setReviewOpen(false);
      return;
    }

    await formik.submitForm();
  };

  return (
    <div className="min-h-screen bg-page px-4 pb-8
      pt-20 sm:px-6 sm:pt-20 lg:px-8 lg:pt-8"
    >
      <header className="mb-6 flex flex-col justify-between
        gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <div className="mb-2 flex items-center gap-2
            text-xs font-medium text-neutral-500"
          >
            <span>Trigvent</span>
            <span className="text-neutral-300">/</span>
            <span>Human Resources</span>
            <span className="text-neutral-300">/</span>
            <span className="text-brand-teal">Add Employee</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight
            text-brand-navy sm:text-3xl"
          >
            Employee Management
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Create a new employee record and manage their details.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl
          border border-border-default bg-white px-3.5 py-2.5
          text-xs font-medium text-neutral-600 shadow-sm sm:self-auto"
        >
          <ShieldCheck size={17} className="text-brand-teal" />
          Employee information
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border
        border-border-default/80 bg-white shadow-sm"
      >
        <div className="border-b border-border-default bg-white p-4 sm:p-6">
          <StepNavigation activeStep={activeStep} onStepClick={goToStep} />
          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Step {activeStep + 1} of {employeeSteps.length}
            </p>
            <p className="text-xs font-medium text-brand-teal-dark">
              {Math.round(((activeStep + 1) / employeeSteps.length) * 100)}%
              {" "}complete
            </p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-brand-teal transition-all duration-300"
              style={{
                width: `${((activeStep + 1) / employeeSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <Form noValidate>
          <div className="space-y-5 p-4 sm:p-6 lg:p-7">
            {activeStep === 0 && (
              <PersonalDetailsStep
                field={field}
                form={form}
                errors={errors}
                updateField={updateField}
                getNextEmployeeCode={getNextEmployeeCode}
                nextEmployeeCodeLoading={nextEmployeeCodeLoading}
                nextEmployeeCodeError={nextEmployeeCodeError}
                updateState={updateState}
                states={states}
                departments={departments}
                designations={designations}
                cities={cities}
              />
            )}

            {activeStep === 1 && (
              <LoginDetailsStep
                field={field}
                form={form}
                errors={errors}
                updateField={updateField}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
            )}

            {activeStep === 2 && (
              <BankDetailsStep field={field} updateField={updateField} />
            )}

            {activeStep === 3 && (
              <NotesReviewStep
                field={field}
                form={form}
                addNote={addNote}
                updateNote={updateNote}
                removeNote={removeNote}
                departments={departments}
                designations={designations}
              />
            )}

            <div className="flex flex-col-reverse justify-between
              gap-3 border-t border-border-light pt-5 sm:flex-row
              sm:items-center"
            >
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 0) {
                    navigate("/employees");
                  } else {
                    setActiveStep((step) => step - 1);
                  }
                }}
                className="inline-flex items-center justify-center
                  gap-2 rounded-xl border border-border-default
                  bg-white px-5 py-3 text-sm font-semibold
                  text-neutral-600 transition hover:bg-surface-subtle"
              >
                <ArrowLeft size={17} />
                {activeStep === 0 ? "Cancel" : "Previous"}
              </button>

              {activeStep < employeeSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(activeStep + 1)}
                  className="inline-flex items-center justify-center
                    gap-2 rounded-xl bg-brand-teal px-5 py-3
                    text-sm font-semibold text-white shadow-sm
                    transition hover:bg-brand-teal-dark
                    focus:outline-none focus:ring-4
                    focus:ring-brand-teal/20"
                >
                  Continue to {employeeSteps[activeStep + 1].label}
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setReviewOpen(true)}
                  disabled={creating}
                  className="inline-flex items-center justify-center
                    gap-2 rounded-xl bg-brand-teal px-5 py-3
                    text-sm font-semibold text-white shadow-sm
                    transition hover:bg-brand-teal-dark disabled:cursor-not-allowed
                    disabled:opacity-60"
                >
                  <Save size={17} />
                  {creating ? "Saving Employee..." : "Save Employee"}
                </button>
              )}
            </div>
          </div>
        </Form>
      </div>

      {reviewOpen && (
        <div className="fixed inset-0 z-[70] flex items-center
          justify-center bg-navy-dark/40 p-4 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md rounded-2xl border
              border-border-default bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center
              justify-center rounded-xl bg-brand-teal-soft text-brand-teal"
            >
              <Save size={22} />
            </div>
            <h2
              id="confirm-title"
              className="mt-4 text-lg font-semibold text-brand-navy"
            >
              Save employee details?
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              You are about to submit the employee record for{" "}
              <span className="font-semibold text-text-secondary">
                {`${form.firstName} ${form.lastName}`.trim()}
              </span>
              . Please ensure the information is correct.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                disabled={creating}
                className="rounded-xl border border-border-default
                  px-4 py-2.5 text-sm font-semibold
                  text-neutral-600 hover:bg-surface-subtle"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={confirmSubmit}
                disabled={creating}
                className="inline-flex items-center
                  justify-center gap-2 rounded-xl
                  bg-brand-teal px-4 py-2.5 text-sm
                  font-semibold text-white hover:bg-brand-teal-dark
                  disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={17} />
                {creating ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
