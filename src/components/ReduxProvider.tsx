'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from "@/components/ui/Toaster";
import ThemeProvider from './ThemeProvider';

export default function ReduxProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
} 