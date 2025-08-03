'use client';

import { ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

interface BodyContentProps {
  children: ReactNode;
  fontClasses: string;
}

function BodyContent({ children, fontClasses }: BodyContentProps) {
  const { theme } = useTheme();
  
  const bodyStyles = theme === 'light'
    ? `flex flex-col min-h-screen bg-gray-50 ${fontClasses}`
    : `flex flex-col min-h-screen bg-black ${fontClasses}`;

  return (
    <div className={bodyStyles}>
      <Nav />
      <main className="flex-grow">
        <div className="mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

interface BodyWrapperProps {
  children: ReactNode;
  fontClasses: string;
}

export default function BodyWrapper({ children, fontClasses }: BodyWrapperProps) {
  return (
    <ThemeProvider>
      <BodyContent fontClasses={fontClasses}>
        {children}
      </BodyContent>
    </ThemeProvider>
  );
} 