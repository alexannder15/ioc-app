'use client';
import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  // call hooks in a stable order every render
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label='Toggle theme'
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className='size-4' />
      ) : (
        <Moon className='size-4' />
      )}
    </Button>
  );
}
