'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Palette = 'default' | 'sunset' | 'ocean';

// export the interface so other files can reference it if needed
export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  palette: Palette;
  setPalette: (p: Palette) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// NOTE: palettes should NOT override background/foreground.
// Keep palettes focused on primary / accent / muted tokens so the theme base
// (light / dark) controls background and foreground, and palettes only change
// the accent/primary visuals. This preserves the "darkness" when toggling theme.
const PALETTES: Record<Palette, Record<string, string>> = {
  default: {
    '--theme-primary': 'oklch(0.205 0 0)',
    '--theme-primary-foreground': 'oklch(0.985 0 0)',
    '--theme-accent': 'oklch(0.97 0 0)',
    '--theme-accent-foreground': 'oklch(0.205 0 0)',
    '--theme-muted': 'oklch(0.97 0 0)',
    '--theme-muted-foreground': 'oklch(0.556 0 0)',
  },
  sunset: {
    '--theme-primary': '#ff7a59',
    '--theme-primary-foreground': '#1f1f1f',
    '--theme-accent': '#ffd277',
    '--theme-accent-foreground': '#1f1f1f',
    '--theme-muted': '#f7e8d9',
    '--theme-muted-foreground': '#3a2b22',
  },
  ocean: {
    '--theme-primary': '#0ea5a4',
    '--theme-primary-foreground': '#001f3f',
    '--theme-accent': '#60a5fa',
    '--theme-accent-foreground': '#001f3f',
    '--theme-muted': '#e6f6fa',
    '--theme-muted-foreground': '#053241',
  },
};

const THEME_BASE: Record<'light' | 'dark', Record<string, string>> = {
  light: {
    '--theme-background': 'oklch(1 0 0)',
    '--theme-foreground': 'oklch(0.145 0 0)',
    '--theme-card': 'oklch(1 0 0)',
    '--theme-card-foreground': 'oklch(0.145 0 0)',
  },
  dark: {
    '--theme-background': 'oklch(0.145 0 0)',
    '--theme-foreground': 'oklch(0.985 0 0)',
    '--theme-card': 'oklch(0.205 0 0)',
    '--theme-card-foreground': 'oklch(0.985 0 0)',
  },
};

function readCookie(name: string) {
  try {
    if (typeof document === 'undefined') return null;
    const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}
function setCookie(name: string, value: string) {
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${
      60 * 60 * 24 * 365
    }; SameSite=Lax`;
  } catch {}
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialTheme =
    (typeof window !== 'undefined' && window.__INITIAL_THEME) ||
    readCookie('theme') ||
    (typeof window !== 'undefined' ? localStorage.getItem('theme') : null) ||
    'light';

  const initialPalette =
    readCookie('palette') ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('palette')
      : 'default') ||
    'default';

  const [theme, setTheme] = useState<Theme>(
    initialTheme === 'dark' ? 'dark' : 'light'
  );
  const [palette, setPaletteState] = useState<Palette>(
    (initialPalette as Palette) || 'default'
  );

  useEffect(() => {
    const root = document.documentElement;

    // toggle class for any "dark" CSS that depends on it
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');

    // set data-theme for any consumers/readers
    root.setAttribute('data-theme', theme);

    // apply theme base variables (ensures immediate color change)
    const baseVars = THEME_BASE[theme];
    Object.entries(baseVars).forEach(([k, v]) => root.style.setProperty(k, v));

    // re-apply current palette so palette values win over the base (preserves palette when toggling theme)
    const paletteVars = PALETTES[palette] || PALETTES.default;
    Object.entries(paletteVars).forEach(([k, v]) =>
      root.style.setProperty(k, v)
    );

    try {
      localStorage.setItem('theme', theme);
    } catch {}

    setCookie('theme', theme);
  }, [theme, palette]);

  useEffect(() => {
    // apply palette variables to :root (keeps palette on top of theme base)
    const vars = PALETTES[palette] || PALETTES.default;
    const rootStyle = document.documentElement.style;
    Object.entries(vars).forEach(([k, v]) => rootStyle.setProperty(k, v));
    try {
      localStorage.setItem('palette', palette);
    } catch {}
    setCookie('palette', palette);
  }, [palette]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const setPalette = (p: Palette) => setPaletteState(p);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

// explicitly declare the return type so callers know palette & setPalette exist
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx) return ctx;

  // fallback: return safe defaults and no-op setters so components work outside provider
  const fallbackTheme: Theme =
    typeof window !== 'undefined' && window.__INITIAL_THEME === 'dark'
      ? 'dark'
      : 'light';
  const fallbackPalette =
    (typeof window !== 'undefined'
      ? (localStorage.getItem('palette') as Palette | null)
      : null) || 'default';

  return {
    theme: fallbackTheme,
    toggleTheme: () => {},
    palette: fallbackPalette,
    setPalette: () => {},
  };
}
