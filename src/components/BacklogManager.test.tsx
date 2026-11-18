import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BacklogManager from './BacklogManager';
import { getStarterAppState } from '../utils/starterData';

describe('BacklogManager Component', () => {
  it('renders active backlogs and allows resolving them', () => {
    const state = getStarterAppState();
    state.backlogs = [
      {
        id: 'b1',
        createdDate: '2026-11-16',
        subject: 'Physics',
        taskTitle: 'HC Verma Rotational Ex 15-25',
        assignedForSunday: false,
        resolved: false,
      },
    ];
    const onUpdate = vi.fn();
    render(<BacklogManager state={state} onUpdateState={onUpdate} />);

    expect(screen.getByText(/HC Verma Rotational Ex 15-25/i)).toBeDefined();
    const resolveBtn = screen.getByRole('button', { name: /^Resolve$/i });
    fireEvent.click(resolveBtn);
    expect(onUpdate).toHaveBeenCalled();
  });

  it('allows toggling Sunday assignment', () => {
    const state = getStarterAppState();
    state.backlogs = [
      {
        id: 'b2',
        createdDate: '2026-11-16',
        subject: 'Mathematics',
        taskTitle: 'Binomial Theorem DPP',
        assignedForSunday: false,
        resolved: false,
      },
    ];
    const onUpdate = vi.fn();
    render(<BacklogManager state={state} onUpdateState={onUpdate} />);

    const assignBtn = screen.getByRole('button', { name: /Queue for Sunday|Sunday/i });
    fireEvent.click(assignBtn);
    expect(onUpdate).toHaveBeenCalled();
  });
});
