import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import logo from "../assets/trigvent-logo.png";
import axiosInstance from "../api/axiosInstance";

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email address is required."),
});

export default function ForgotPassword() {
  const [serverMessage, setServerMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerMessage("");

      try {
        const response = await axiosInstance.post("/auth/forgot-password", {
          email: values.email.trim(),
        });

        setServerMessage(
          response.data?.message ||
            "If this email is registered, password reset instructions will be sent."
        );
        setSubmitted(true);
      } catch (error) {
        setServerMessage(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Unable to send reset instructions. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <main className="min-h-screen bg-surface-muted p-0 sm:grid sm:place-items-center sm:p-6">
      <div className="grid min-h-screen w-full overflow-hidden bg-white sm:min-h-0 sm:max-w-6xl sm:rounded-[28px] sm:shadow-[0_24px_70px_rgba(32,61,97,0.18)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-brand-navy px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-teal/20 blur-2xl" />
          <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-cyan/15 blur-2xl" />

          <div className="relative z-10 flex h-16 w-full items-center rounded-xl bg-white px-5">
            <img
              src={logo}
              alt="Trigvent"
              className="h-auto max-h-14 w-full object-contain object-left"
            />
          </div>

          <div className="relative z-10 my-auto py-14">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal shadow-lg shadow-brand-teal/20">
              <ShieldCheck size={28} />
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#70D2D2]">
              Account Recovery
            </p>
            <h2 className="max-w-md text-4xl font-semibold leading-tight">
              Reset your password securely.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-border-muted">
              Enter your work email and we will send instructions to help you
              regain access to your account.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#70D2D2]" />
            Secure employee access
          </div>
        </section>

        <section className="flex min-h-screen items-center px-5 py-10 sm:min-h-[650px] sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex h-14 w-52 items-center rounded-lg bg-brand-navy px-4 lg:hidden">
              <img
                src={logo}
                alt="Trigvent"
                className="h-auto max-h-12 w-full object-contain object-left"
              />
            </div>

            <Link
              to="/login"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-brand-teal-dark"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>

            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-brand-teal">
                Password recovery
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
                Forgot your password?
              </h1>
              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Enter the email address associated with your account.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-xl border border-success-soft bg-success-soft px-5 py-5">
                <CheckCircle2 className="mb-3 text-success" size={28} />
                <h2 className="font-semibold text-brand-navy">
                  Check your email
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {serverMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setServerMessage("");
                    formik.resetForm();
                  }}
                  className="mt-5 text-sm font-semibold text-brand-teal hover:text-brand-teal-dark"
                >
                  Use another email
                </button>
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-brand-navy"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="email"
                      placeholder="name@trigvent.com"
                      className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:ring-4 ${
                        formik.touched.email && formik.errors.email
                          ? "border-danger focus:border-danger focus:ring-danger-soft"
                          : "border-border-default focus:border-brand-teal focus:ring-brand-teal/10"
                      }`}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-danger">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {serverMessage && (
                  <div className="mb-4 rounded-xl border border-danger-soft bg-danger-soft px-4 py-3">
                    <p className="text-sm font-medium text-danger">
                      {serverMessage}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="flex w-full items-center justify-center rounded-xl bg-brand-teal px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-teal/20 transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-brand-teal/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {formik.isSubmitting ? "Sending..." : "Send reset instructions"}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
