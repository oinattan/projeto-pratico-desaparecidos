"use client";
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
  <NextThemesProvider
  attribute="class"
  defaultTheme="light"
  enableSystem={false}
  disableTransitionOnChange={true}>
  
  {children}
  </NextThemesProvider>);

}