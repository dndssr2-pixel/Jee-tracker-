import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodayRoutine from './TodayRoutine';
import { getStarterAppState, getJEEPresetTimetable } from '../utils/starterData';

describe('TodayRoutine Component', () => {
  it('renders today routine slots and progress bar', () => {
    const state = getStarterAppState();
    const onUpdate = vi.fn();
    render(<TodayRoutine state={state} onUpdateState={onUpdate} selectedDate="2026-11-17" />);

    expect(screen.getByText(/Daily Routine/i)).toBeDefined();
    expect(screen.getByText(/Progress/i)).toBeDefined();
  });

  it('updates slot status to completed when done clicked', () => {
    const state = getStarterAppState();
    state.timetable = getJEEPresetTimetable();
    const onUpdate = vi.fn();
    render(<TodayRoutine state={state} onUpdateState={onUpdate} selectedDate="2026-11-17" />);

    const doneButtons = screen.getAllByRole('button', { name: /Done|Complete/i });
    expect(doneButtons.length).toBeGreaterThan(0);
    fireEvent.click(doneButtons[0]);
    expect(onUpdate).toHaveBeenCalled();
  });

  it('allows moving a slot to backlog', () => {
    const state = getStarterAppState();
    state.timetable = getJEEPresetTimetable();
    const onUpdate = vi.fn();
    render(<TodayRoutine state={state} onUpdateState={onUpdate} selectedDate="2026-11-17" />);

    const backlogButtons = screen.getAllByRole('button', { name: /Backlog|Skip/i });
    expect(backlogButtons.length).toBeGreaterThan(0);
    fireEvent.click(backlogButtons[0]);
    expect(onUpdate).toHaveBeenCalled();
  });
});
