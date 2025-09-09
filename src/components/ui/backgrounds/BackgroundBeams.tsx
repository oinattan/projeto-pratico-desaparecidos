"use client";
import React from "react";
import { cn } from "../../../lib/utils";

export const BackgroundBeams = ({ className }: {className?: string;}) => {
  return (
  <div
  className={cn(
    "absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",
    className
  )}>

  {}
  <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

  {}
  <div className="absolute inset-0">
    {}
    <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse" />
    <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />

    {}
    <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
    <div className="absolute left-3/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />

    {}
    <div className="absolute top-10 left-10 w-20 h-20 border border-blue-500/20 rotate-45" />
    <div className="absolute bottom-10 right-10 w-16 h-16 border border-purple-500/20 -rotate-12" />
  </div>

  {}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
  </div>);

};