import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { Eye, EyeOff, KeyRound } from "lucide-react";

import { changePassword } from "../redux/actions/authActions";
import { clearPasswordStatus } from "../redux/slices/authSlice";
import { changePasswordValidationSchema } from "../validations/authValidation";

export default function ChangePasswordDialog({ open, onClose }) {
  const dispatch = useDispatch();
  const { passwordLoading, passwordError, passwordSuccess } = useSelector(
    (state) => state.auth
  );
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    password: false,
    passwordConfirmation: false,
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(changePassword(values));

      if (changePassword.fulfilled.match(result)) {
        resetForm();
      }
    },
  });

  const handleClose = () => {
    if (passwordLoading) return;

    formik.resetForm();
    dispatch(clearPasswordStatus());
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
    >
      <form
        onSubmit={formik.handleSubmit}
        noValidate
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal-soft text-brand-teal">
          <KeyRound size={21} />
        </div>
        <h2 id="change-password-title" className="mt-4 text-lg font-semibold text-brand-navy">
          Change Password
        </h2>

        <div className="mt-5 space-y-4">
          {[
            {
              name: "oldPassword",
              label: "Old password",
              autoComplete: "current-password",
            },
            {
              name: "password",
              label: "New password",
              autoComplete: "new-password",
            },
            {
              name: "passwordConfirmation",
              label: "Confirm new password",
              autoComplete: "new-password",
            },
          ].map((field) => (
            <label key={field.name} className="block text-sm font-medium text-text-secondary">
              {field.label}
              <div className="relative mt-2">
                <input
                  id={field.name}
                  name={field.name}
                  type={passwordVisibility[field.name] ? "text" : "password"}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete={field.autoComplete}
                  className={`w-full rounded-xl border px-3.5 py-2.5 pr-11 text-sm text-brand-navy outline-none focus:ring-4 ${
                    formik.touched[field.name] && formik.errors[field.name]
                      ? "border-danger focus:ring-danger-soft"
                      : "border-border-default focus:border-brand-teal focus:ring-brand-teal/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setPasswordVisibility((current) => ({
                      ...current,
                      [field.name]: !current[field.name],
                    }))
                  }
                  aria-label={`${passwordVisibility[field.name] ? "Hide" : "Show"} ${field.label.toLowerCase()}`}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-navy"
                >
                  {passwordVisibility[field.name] ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {formik.touched[field.name] && formik.errors[field.name] && (
                <p className="mt-1.5 text-xs font-medium text-danger">
                  {formik.errors[field.name]}
                </p>
              )}
            </label>
          ))}
        </div>

        {passwordError && (
          <p role="alert" className="mt-4 rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
            {passwordError}
          </p>
        )}
        {passwordSuccess && (
          <p role="status" className="mt-4 rounded-xl bg-success-soft px-3 py-2 text-sm text-success-dark">
            {passwordSuccess}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={passwordLoading}
            className="rounded-xl border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-xl bg-brand-teal px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {passwordLoading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
