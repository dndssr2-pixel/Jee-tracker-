import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DailyLogger from './DailyLogger';
import { getStarterAppState } from '../utils/starterData';

describe('DailyLogger Component', () => {
  it('renders daily logger form with study hours and question targets', () => {
    const state = getStarterAppState();
    const onUpdate = vi.fn();
    render(<DailyLogger state={state} onUpdateState={onUpdate} selectedDate="2026-11-17" />);

    expect(screen.getByText(/Daily Study Performance Logger/i)).toBeDefined();
    expect(screen.getByText(/Physics Hours/i)).toBeDefined();
    expect(screen.getByText(/Chemistry Hours/i)).toBeDefined();
    expect(screen.getByText(/Mathematics Hours/i)).toBeDefined();
    expect(screen.getByText(/Questions Target/i)).toBeDefined();
  });

  it('allows saving daily log', () => {
    const state = getStarterAppState();
    const onUpdate = vi.fn();
    render(<DailyLogger state={state} onUpdateState={onUpdate} selectedDate="2026-11-17" />);

    const saveBtn = screen.getByRole('button', { name: /Save Daily Log/i });
    fireEvent.click(saveBtn);
    expect(onUpdate).toHaveBeenCalled();
  });
});
