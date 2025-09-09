"use client";
import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
  return (
  <div className="space-y-1">
    {label &&
    <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">
        {label}
      </label>
    }
    <input
      ref={ref}
      className={`
        w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
        bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
        placeholder-white/60 dark:placeholder-slate-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
        focus:border-transparent transition-colors
        disabled:bg-slate-50 dark:disabled:bg-slate-900
        disabled:text-slate-500 dark:disabled:text-slate-400
        disabled:cursor-not-allowed
        ${error ? 'border-red-500 dark:border-red-400' : ''}
        ${className}
      `}
      {...props} />
    
    {error &&
    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
    }
    {helperText && !error &&
    <p className="text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
    }
  </div>);

  }
);

Input.displayName = "Input";