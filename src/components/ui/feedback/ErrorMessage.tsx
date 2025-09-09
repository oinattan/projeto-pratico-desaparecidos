import React from "react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
  <div className="text-center p-6">
  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
    <svg
      className="w-8 h-8 text-red-600 dark:text-red-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24">
      
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      
    </svg>
  </div>
  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
    Erro ao carregar dados
  </h3>
  <p className="text-slate-600 dark:text-slate-400">{message}</p>
  </div>);

}