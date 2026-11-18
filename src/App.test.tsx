import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Smoke Test', () => {
  it('renders application title', () => {
    render(<App />);
    expect(screen.getAllByText(/JEE/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Today's Routine/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Timetable Planner/i })).toBeDefined();
  });
});
