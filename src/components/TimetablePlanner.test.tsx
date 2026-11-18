import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TimetablePlanner from './TimetablePlanner';
import { getStarterAppState, getJEEPresetTimetable } from '../utils/starterData';

describe('TimetablePlanner Component', () => {
  it('renders days of week and shows slots for selected day', () => {
    const state = getStarterAppState();
    const onUpdate = vi.fn();
    render(<TimetablePlanner state={state} onUpdateState={onUpdate} />);

    expect(screen.getAllByText('Monday').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Sunday/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Add Time Slot/i })).toBeDefined();
  });

  it('allows switching active day tab', () => {
    const state = getStarterAppState();
    state.timetable = getJEEPresetTimetable();
    const onUpdate = vi.fn();
    render(<TimetablePlanner state={state} onUpdateState={onUpdate} />);

    const sundayTab = screen.getByRole('button', { name: /Sunday/i });
    fireEvent.click(sundayTab);
    expect(screen.getByText(/Revision & Backlog Clearance/i)).toBeDefined();
  });

  it('opens add time slot modal when clicked', () => {
    const state = getStarterAppState();
    const onUpdate = vi.fn();
    render(<TimetablePlanner state={state} onUpdateState={onUpdate} />);

    const addBtn = screen.getByRole('button', { name: /Add Time Slot/i });
    fireEvent.click(addBtn);
    expect(screen.getByText(/Create New Time Slot/i)).toBeDefined();
  });
});
