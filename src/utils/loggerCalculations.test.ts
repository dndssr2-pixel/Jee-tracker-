import { describe, it, expect } from 'vitest';
import { tallyRoutineStudyHours, calculateUpdatedStreak } from './loggerCalculations';
import { DailyRoutineRecord } from '../types';

describe('tallyRoutineStudyHours', () => {
  it('correctly sums completed hours by subject', () => {
    const routine: DailyRoutineRecord = {
      date: '2026-11-17',
      dayOfWeek: 'Tuesday',
      slots: [
        { id: '1', dayOfWeek: 'Tuesday', startTime: '06:00', endTime: '07:30', subject: 'Physics', title: 'P1', status: 'completed' },
        { id: '2', dayOfWeek: 'Tuesday', startTime: '08:00', endTime: '10:00', subject: 'Mathematics', title: 'M1', status: 'completed' },
        { id: '3', dayOfWeek: 'Tuesday', startTime: '10:30', endTime: '12:00', subject: 'Chemistry', title: 'C1', status: 'pending' },
        { id: '4', dayOfWeek: 'Tuesday', startTime: '13:00', endTime: '14:00', subject: 'Revision', title: 'R1', status: 'completed' },
      ],
    };

    const tally = tallyRoutineStudyHours(routine);
    expect(tally.physics).toBe(1.5);
    expect(tally.maths).toBe(2);
    expect(tally.chemistry).toBe(0);
    expect(tally.revision).toBe(1);
    expect(tally.total).toBe(4.5);
  });

  it('handles empty or undefined routine gracefully', () => {
    const tally = tallyRoutineStudyHours(undefined);
    expect(tally.total).toBe(0);
    expect(tally.physics).toBe(0);
  });
});

describe('calculateUpdatedStreak', () => {
  it('increments streak if logged on consecutive day', () => {
    expect(calculateUpdatedStreak(3, '2026-11-16', '2026-11-17')).toBe(4);
  });

  it('keeps streak identical if logging again on the same day', () => {
    expect(calculateUpdatedStreak(3, '2026-11-17', '2026-11-17')).toBe(3);
  });

  it('resets streak to 1 if one or more days were skipped', () => {
    expect(calculateUpdatedStreak(5, '2026-11-10', '2026-11-17')).toBe(1);
  });
});
