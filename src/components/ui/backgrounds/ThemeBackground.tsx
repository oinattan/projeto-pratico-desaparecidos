"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BackgroundBeams } from "./BackgroundBeams";
import { BackgroundRippleEffect } from "./BackgroundRippleEffect";

interface ThemeBackgroundProps {
  className?: string;
}

export function ThemeBackground({ className }: ThemeBackgroundProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
  setMounted(true);

  const timer = setTimeout(() => setShowContent(true), 100);
  return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
  return null;
  }

  const isDark = theme === 'dark';

  return (
  <div className={`transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
  {isDark ?
  <BackgroundBeams className={className} /> :

  <BackgroundRippleEffect className={className} />
  }
  </div>);

}