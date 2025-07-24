import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "medium",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "gradient-primary text-white shadow-lg",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white",
    info: "bg-info text-white",
    high: "bg-gradient-to-r from-error to-orange-500 text-white",
    medium: "bg-gradient-to-r from-warning to-yellow-500 text-white",
    low: "bg-gradient-to-r from-success to-green-400 text-white",
  };

  const sizes = {
    small: "px-2 py-0.5 text-xs font-medium",
    medium: "px-2.5 py-1 text-xs font-semibold",
    large: "px-3 py-1.5 text-sm font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;