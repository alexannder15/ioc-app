import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import ThemePaletteSelector from '../ThemePaletteSelector';

test('selecting palette updates CSS variables', async () => {
  render(
    <ThemeProvider>
      <ThemePaletteSelector />
    </ThemeProvider>
  );

  const sunset = screen.getByRole('button', { name: /Sunset/i });
  fireEvent.click(sunset);

  await waitFor(() => {
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue('--theme-primary')
      .trim();
    expect(val).toBe('#ff7a59');
  });
});
