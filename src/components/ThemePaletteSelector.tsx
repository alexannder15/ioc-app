'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

export default function ThemePaletteSelector() {
  // call hooks in consistent order
  const themeCtx = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (!themeCtx) return null; // defensive, though useTheme now returns a fallback
  const { palette, setPalette } = themeCtx;

  const palettes: { key: any; label: string }[] = [
    { key: 'default', label: 'Default' },
    { key: 'sunset', label: 'Sunset' },
    { key: 'ocean', label: 'Ocean' },
  ];

  return (
    <div className='flex gap-2 items-center'>
      {palettes.map((p) => (
        <Button
          key={p.key}
          variant={p.key === palette ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setPalette(p.key as any)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
