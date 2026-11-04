
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import logo from "../assets/trigvent-logo.png";
import { loginUser } from "../redux/actions/authActions";
import { clearError } from "../redux/slices/authSlice";
import { loginValidationSchema } from "../validations/authValidation";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },

    validationSchema: loginValidationSchema,

    onSubmit: async (values) => {
      try {
        // Send only API-required credentials
        const credentials = {
          email: values.email.trim(),
          password: values.password,
          remember: values.remember,
        };

        await dispatch(loginUser(credentials)).unwrap();

        // Navigate only after successful API response
        navigate(location.state?.from?.pathname || "/dashboard", {
          replace: true,
        });
      } catch (err) {
        console.error("Login failed:", err);
      }
    },
  });

  const handleFieldChange = (event) => {
    formik.handleChange(event);

    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <main className="min-h-screen bg-surface-muted p-0 sm:grid sm:place-items-center sm:p-6">
      <div className="grid min-h-screen w-full overflow-hidden bg-white sm:min-h-0 sm:max-w-6xl sm:rounded-[28px] sm:shadow-[0_24px_70px_rgba(32,61,97,0.18)] lg:grid-cols-[0.95fr_1.05fr]">

        {/* Left Section */}
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
              Employee Workspace
            </p>

            <h2 className="max-w-md text-4xl font-semibold leading-tight">
              Everything you need, in one secure place.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-border-muted">
              Access company updates, manage work, and stay connected
              with your team from the Trigvent intranet.
            </p>

          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#70D2D2]" />
            Secure employee access
          </div>

        </section>

        {/* Right Section */}
        <section className="flex min-h-screen items-center px-5 py-10 sm:min-h-[650px] sm:px-10 lg:px-16">

          <div className="mx-auto w-full max-w-md">

            <div className="mb-8 flex h-14 w-52 items-center rounded-lg bg-brand-navy px-4 lg:hidden">
              <img
                src={logo}
                alt="Trigvent"
                className="h-auto max-h-12 w-full object-contain object-left"
              />
            </div>

            <div className="mb-8">

              <p className="mb-2 text-sm font-semibold text-brand-teal">
                Welcome back
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
                Sign in to your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Enter your work email and password to continue.
              </p>

            </div>

            <form onSubmit={formik.handleSubmit} noValidate>

              {/* Email Field */}
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
                    onChange={handleFieldChange}
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

              {/* Password Field */}
              <div className="mb-4">

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-brand-navy"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-brand-teal hover:text-brand-teal-dark"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={handleFieldChange}
                    onBlur={formik.handleBlur}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-11 text-sm text-brand-navy outline-none transition placeholder:text-neutral-400 focus:ring-4 ${
                      formik.touched.password && formik.errors.password
                        ? "border-danger focus:border-danger focus:ring-danger-soft"
                        : "border-border-default focus:border-brand-teal focus:ring-brand-teal/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 hover:text-brand-navy"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-danger">
                    {formik.errors.password}
                  </p>
                )}

              </div>

              {/* Remember Me */}
              <label className="mb-6 flex w-fit cursor-pointer items-center gap-2.5 text-sm text-neutral-600">

                <input
                  type="checkbox"
                  name="remember"
                  checked={formik.values.remember}
                  onChange={formik.handleChange}
                  className="h-4 w-4 accent-brand-teal"
                />

                Keep me signed in

              </label>

              {/* API Error */}
              {error && (
                <div className="mb-4 rounded-xl border border-danger-soft bg-danger-soft px-4 py-3">
                  <p className="text-sm font-medium text-danger">
                    {typeof error === "string"
                      ? error
                      : "Unable to sign in. Please try again."}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || formik.isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-brand-teal px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-teal/20 transition hover:bg-brand-teal-dark focus:outline-none focus:ring-4 focus:ring-brand-teal/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading || formik.isSubmitting
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>

            <p className="mt-8 text-center text-xs text-neutral-400">
              Need help? Contact your HR or system administrator.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}
