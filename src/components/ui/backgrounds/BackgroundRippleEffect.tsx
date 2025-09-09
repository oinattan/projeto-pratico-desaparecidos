"use client";
import React, { useRef, useEffect, useState } from "react";
import { cn } from "../../../lib/utils";

interface RippleEffectProps {
  className?: string;
}

export const BackgroundRippleEffect: React.FC<RippleEffectProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Array<{id: string;x: number;y: number;}>>([]);

  useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleClick = (e: MouseEvent) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const newRipple = {
    id: Date.now().toString(),
    x,
    y
  };

  setRipples((prev) => [...prev, newRipple]);

  setTimeout(() => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
  }, 1000);
  };

  container.addEventListener('click', handleClick);

  return () => {
  container.removeEventListener('click', handleClick);
  };
  }, []);

  return (
  <div
  ref={containerRef}
  className={cn(
    "absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100",
    className
  )}>

  {}
  <div className="absolute inset-0 bg-grid-slate-200/40 bg-[size:60px_60px]" />

  {}
  <div className="absolute inset-0">
    {}
    <div className="absolute top-10 left-10 w-32 h-32 border border-slate-300/30 rotate-45" />
    <div className="absolute top-20 right-20 w-24 h-24 border border-blue-300/20 rotate-12" />
    <div className="absolute bottom-20 left-20 w-20 h-20 border border-slate-400/20 -rotate-12" />
    <div className="absolute bottom-10 right-10 w-28 h-28 border border-blue-200/30 rotate-45" />

    {}
    {[...Array(8)].map((_, i) =>
    <div
      key={i}
      className="absolute w-2 h-2 bg-slate-400/20 rounded-sm animate-pulse"
      style={{
        left: `${20 + i * 10}%`,
        top: `${30 + i * 8}%`,
        animationDelay: `${i * 0.5}s`,
        animationDuration: `${3 + i % 2}s`
      }} />

    )}
  </div>

  {}
  {ripples.map((ripple) =>
  <div
    key={ripple.id}
    className="absolute pointer-events-none"
    style={{
      left: ripple.x,
      top: ripple.y,
      transform: 'translate(-50%, -50%)'
    }}>

      <div className="w-4 h-4 border-2 border-blue-400/60 rounded-full animate-ping" />
      <div className="absolute inset-0 w-4 h-4 bg-blue-400/20 rounded-full animate-ping" style={{ animationDelay: '0.1s' }} />
    </div>
  )}

  {}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
  </div>);

};