import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white shadow-premium border border-gray-200",
    glass: "glass-surface shadow-premium",
    gradient: "gradient-card shadow-premium border-0",
    elevated: "bg-white shadow-premium-hover border border-gray-200",
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-300 ease-out",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;