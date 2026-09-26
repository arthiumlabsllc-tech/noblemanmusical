"use client";

import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode, type ButtonHTMLAttributes, forwardRef } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const variantClasses = {
  gold: "bg-gold text-navy-deep hover:bg-gold-light",
  outline: "border-2 border-gold text-gold hover:bg-gold hover:text-navy-deep",
  ghost: "text-gold hover:bg-gold/10",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ children, className, variant = "gold", size = "md", asChild, ...props }, ref) => {
    const combinedClasses = cn(
      "btn-shimmer relative inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300",
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    if (asChild) {
      return (
        <motion.span
          className={cn(combinedClasses, "cursor-pointer")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {children}
        </motion.span>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={combinedClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...(props as MotionProps & ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </motion.button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
