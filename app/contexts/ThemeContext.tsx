'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isToolsPage: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const pathname = usePathname();
  const isToolsPage = pathname?.startsWith('/tools/') || false;
  const theme: Theme = isToolsPage ? 'light' : 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isToolsPage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 