import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Info, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

const toastStyles = {
  success: {
    icon: CheckCircle2,
    iconClassName: "text-success",
    borderClassName: "border-success/20",
  },
  error: {
    icon: XCircle,
    iconClassName: "text-danger",
    borderClassName: "border-danger/20",
  },
  warning: {
    icon: CircleAlert,
    iconClassName: "text-warning-dark",
    borderClassName: "border-warning-dark/20",
  },
  info: {
    icon: Info,
    iconClassName: "text-info",
    borderClassName: "border-info/20",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      setToasts((current) => [
        ...current,
        { id, type, title, message, duration },
      ]);

      if (duration > 0) {
        window.setTimeout(() => dismissToast(id), duration);
      }

      return id;
    },
    [dismissToast]
  );

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.info;
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              role={toast.type === "error" ? "alert" : "status"}
              className={`pointer-events-auto flex gap-3 rounded-2xl border bg-white p-4 shadow-[0_16px_40px_rgba(32,61,97,0.18)] ${style.borderClassName}`}
            >
              <Icon className={`mt-0.5 shrink-0 ${style.iconClassName}`} size={21} />
              <div className="min-w-0 flex-1">
                {toast.title && (
                  <p className="text-sm font-semibold text-brand-navy">
                    {toast.title}
                  </p>
                )}
                {toast.message && (
                  <p className="mt-1 text-sm leading-5 text-neutral-600">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="self-start rounded-md p-1 text-neutral-400 hover:bg-surface-muted hover:text-brand-navy"
              >
                <X size={17} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
