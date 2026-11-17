import { forwardRef } from "react";

const variants = {
  default: "bg-brand-teal text-white shadow-sm hover:bg-brand-teal-dark",
  destructive: "bg-danger text-white shadow-sm hover:bg-danger-dark",
  outline:
    "border border-border-default bg-white text-text-secondary shadow-sm hover:bg-surface-subtle",
  secondary: "bg-surface-muted text-brand-navy hover:bg-border-light",
  ghost: "text-neutral-500 hover:bg-surface-subtle hover:text-brand-navy",
  warning: "bg-warning-dark text-white shadow-sm hover:opacity-90",
};

const sizes = {
  default: "h-10 px-4 py-2.5",
  sm: "h-9 rounded-lg px-3",
  lg: "h-11 px-8",
  icon: "h-9 w-9 p-0",
};

const Button = forwardRef(function Button(
  {
    className = "",
    variant = "default",
    size = "default",
    type = "button",
    ...props
  },
  ref
) {
  const classes = [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variants[variant] || variants.default,
    sizes[size] || sizes.default,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button ref={ref} type={type} className={classes} {...props} />;
});

export default Button;
