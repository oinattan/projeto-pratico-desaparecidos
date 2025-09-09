"use client";
import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
  range.push(i);
  }

  if (page - delta > 2) {
  rangeWithDots.push(1, '...');
  } else {
  rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (page + delta < totalPages - 1) {
  rangeWithDots.push('...', totalPages);
  } else {
  rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
  <nav className="flex items-center justify-center space-x-1">
  {}
  <button
    onClick={() => onChange(page - 1)}
    disabled={page === 1}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    page === 1 ?
    'text-gray-400 dark:text-gray-600 cursor-not-allowed' :
    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`
    }>
    
    Anterior
  </button>

  {}
  {visiblePages.map((pageNum, index) =>
  <React.Fragment key={index}>
      {pageNum === '...' ?
    <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span> :

    <button
      onClick={() => onChange(pageNum as number)}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      page === pageNum ?
      'bg-blue-600 text-white' :
      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`
      }>
      
          {pageNum}
        </button>
    }
    </React.Fragment>
  )}

  {}
  <button
    onClick={() => onChange(page + 1)}
    disabled={page === totalPages}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    page === totalPages ?
    'text-gray-400 dark:text-gray-600 cursor-not-allowed' :
    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`
    }>
    
    Próxima
  </button>
  </nav>);

}