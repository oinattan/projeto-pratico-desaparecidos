"use client";
import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Buscar por nome..." }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSearch(searchTerm);
  };

  const handleClear = () => {
  setSearchTerm("");
  onSearch("");
  };

  return (
  <form onSubmit={handleSubmit} className="relative">
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-white/60 dark:placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    
    
    {searchTerm &&
    <button
      type="button"
      onClick={handleClear}
      className="absolute inset-y-0 right-0 pr-3 flex items-center">
      
        <svg className="h-5 w-5 text-white/70 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    }
  </div>
  
  <button
    type="submit"
    className="mt-2 w-full sm:w-auto sm:ml-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
    
    Buscar
  </button>
  </form>);

}