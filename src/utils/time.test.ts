import { describe, it, expect } from 'vitest';
import { 
  isSlotActive, 
  getMinutesRemaining, 
  calculateSlotDurationMinutes, 
  parseTimeToMinutes, 
  formatMinutesToHours,
  getDayOfWeekFromDate,
  parseLocalDate,
  shiftDateString
} from './time';

describe('Time utilities', () => {
  it('correctly converts HH:MM to minutes', () => {
    expect(parseTimeToMinutes('00:00')).toBe(0);
    expect(parseTimeToMinutes('06:30')).toBe(390);
    expect(parseTimeToMinutes('23:59')).toBe(1439);
  });

  it('correctly detects active time slots', () => {
    expect(isSlotActive('06:00', '07:30', '06:45')).toBe(true);
    expect(isSlotActive('06:00', '07:30', '06:00')).toBe(true);
    expect(isSlotActive('06:00', '07:30', '07:30')).toBe(false);
    expect(isSlotActive('06:00', '07:30', '08:00')).toBe(false);
  });

  it('calculates minutes remaining until slot end', () => {
    expect(getMinutesRemaining('07:30', '07:00')).toBe(30);
    expect(getMinutesRemaining('07:30', '07:30')).toBe(0);
    expect(getMinutesRemaining('07:30', '08:00')).toBe(0);
  });

  it('calculates duration in minutes', () => {
    expect(calculateSlotDurationMinutes('06:00', '07:30')).toBe(90);
    expect(calculateSlotDurationMinutes('23:00', '01:00')).toBe(120); // Spanning midnight
  });

  it('calculates minutes remaining for midnight-spanning slots', () => {
    expect(getMinutesRemaining('01:00', '23:30', '23:00')).toBe(90);
    expect(getMinutesRemaining('01:00', '00:15', '23:00')).toBe(45);
    expect(getMinutesRemaining('01:00', '01:00', '23:00')).toBe(0);
  });

  it('correctly parses local date without UTC offset shift', () => {
    // 2026-11-17 is a Tuesday
    expect(getDayOfWeekFromDate('2026-11-17')).toBe('Tuesday');
    // 2026-11-15 is a Sunday
    expect(getDayOfWeekFromDate('2026-11-15')).toBe('Sunday');
  });

  it('formats minutes to human readable hours', () => {
    expect(formatMinutesToHours(90)).toBe('1.5h');
    expect(formatMinutesToHours(60)).toBe('1h');
    expect(formatMinutesToHours(45)).toBe('45m');
  });
});
