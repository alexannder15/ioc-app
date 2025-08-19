import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeProvider, { useTheme } from '../ThemeProvider';

// small consumer for testing
function Consumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid='theme'>{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

test('hydrates initial theme from window.__INITIAL_THEME and toggles', async () => {
  // simulate server set value
  window.__INITIAL_THEME = 'dark';
  render(
    <ThemeProvider>
      <Consumer />
    </ThemeProvider>
  );

  expect(screen.getByTestId('theme').textContent).toBe('dark');

  fireEvent.click(screen.getByText('toggle'));

  await waitFor(() => {
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });
});
