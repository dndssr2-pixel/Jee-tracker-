import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnalyticsView from './AnalyticsView';
import { getStarterAppState } from '../utils/starterData';

describe('AnalyticsView Component', () => {
  it('renders weekly hours, PCM distribution, and question stats', () => {
    const state = getStarterAppState();
    state.dailyLogs['2026-11-17'] = {
      date: '2026-11-17',
      physicsHours: 3,
      chemistryHours: 2.5,
      mathsHours: 3.5,
      revisionHours: 1,
      otherHours: 0,
      questionsTarget: 60,
      questionsSolved: 55,
      focusRating: 5,
      notes: 'Strong mechanics revision',
    };

    render(<AnalyticsView state={state} />);

    expect(screen.getByText(/Weekly Study Hours/i)).toBeDefined();
    expect(screen.getByText(/PCM Subject Balance/i)).toBeDefined();
    expect(screen.getByText(/Questions Solved/i)).toBeDefined();
  });

  it('renders 0% for PCM meters when no study hours are logged', () => {
    const state = getStarterAppState();
    state.dailyLogs = {};
    state.dailyRoutines = {};
    render(<AnalyticsView state={state} />);

    // Should display 0h (0%) for subjects instead of 33%
    const zeroPcts = screen.getAllByText('0h (0%)');
    expect(zeroPcts.length).toBeGreaterThan(0);
  });
});
