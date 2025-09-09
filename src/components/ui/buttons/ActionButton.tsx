"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ActionButton({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled = false
}: ActionButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
  primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl",
  secondary: "bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 text-slate-700 dark:text-slate-200 focus:ring-slate-500",
  ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:ring-slate-500"
  };

  const sizeClasses = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl"
  };

  const disabledClasses = disabled ?
  "opacity-50 cursor-not-allowed" :
  "cursor-pointer";

  return (
  <motion.button
  whileHover={!disabled ? { scale: 1.02 } : {}}
  whileTap={!disabled ? { scale: 0.98 } : {}}
  onClick={onClick}
  disabled={disabled}
  className={cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className
  )}>
  
  {}
  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
  
  <span className="relative flex items-center gap-2">
    {children}
  </span>
  </motion.button>);

}