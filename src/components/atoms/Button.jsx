import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "medium", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "gradient-primary text-white shadow-premium hover:shadow-premium-hover hover:scale-105",
    secondary: "bg-white text-gray-900 border border-gray-300 shadow-premium hover:shadow-premium-hover hover:bg-gray-50",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600",
    ghost: "text-gray-600 hover:text-primary-600 hover:bg-gray-100",
    danger: "bg-error text-white shadow-premium hover:shadow-premium-hover hover:bg-red-600",
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm font-medium",
    medium: "px-6 py-2.5 text-sm font-semibold",
    large: "px-8 py-3 text-base font-semibold",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;