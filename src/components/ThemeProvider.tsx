'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode } = useAppSelector((state) => state.theme);

  // Apply theme class to HTML element
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // For debugging
    console.log('ThemeProvider: Theme mode applied:', mode);
  }, [mode]);

  return <>{children}</>;
} 