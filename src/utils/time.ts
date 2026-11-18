import { DayOfWeek } from '../types';

/**
 * Parses "YYYY-MM-DD" as a local date (avoiding UTC midnight timezone shifts).
 */
export function parseLocalDate(dateStr: string): Date {
  if (!dateStr || !dateStr.includes('-')) return new Date();
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/**
 * Shifts a "YYYY-MM-DD" string by N days cleanly.
 */
export function shiftDateString(dateStr: string, days: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  const yr = d.getFullYear();
  const mo = (d.getMonth() + 1).toString().padStart(2, '0');
  const da = d.getDate().toString().padStart(2, '0');
  return `${yr}-${mo}-${da}`;
}

/**
 * Converts "HH:MM" (24h) to minutes from midnight (0 - 1439).
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (isNaN(hours) ? 0 : hours) * 60 + (isNaN(minutes) ? 0 : minutes);
}

/**
 * Converts minutes from midnight into formatted 24-hour time.
 */
export function formatMinutesToTime(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Converts 24-hour "HH:MM" to "hh:mm AM/PM".
 */
export function formatTo12Hour(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Returns current local time as "HH:MM" (24h).
 */
export function getCurrentTime24(): string {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Returns today's date formatted as "YYYY-MM-DD".
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns day of week for a given "YYYY-MM-DD" string (or today).
 */
export function getDayOfWeekFromDate(dateStr?: string): DayOfWeek {
  const date = dateStr ? parseLocalDate(dateStr) : new Date();
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Checks if current time falls within [startTime, endTime).
 */
export function isSlotActive(startTime: string, endTime: string, currentTime: string): boolean {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  const current = parseTimeToMinutes(currentTime);

  if (end >= start) {
    // Normal slot within the same day
    return current >= start && current < end;
  } else {
    // Slot spanning midnight (e.g. 23:00 to 01:00)
    return current >= start || current < end;
  }
}

/**
 * Returns minutes remaining until slot end. Handles midnight-spanning slots accurately.
 */
export function getMinutesRemaining(endTime: string, currentTime: string, startTime?: string): number {
  if (startTime && !isSlotActive(startTime, endTime, currentTime)) {
    return 0;
  }

  let end = parseTimeToMinutes(endTime);
  const current = parseTimeToMinutes(currentTime);
  const start = startTime ? parseTimeToMinutes(startTime) : 0;

  if (startTime && end < start) {
    // Slot spans midnight (e.g. start 23:00, end 01:00)
    if (current >= start) {
      return (end + 1440) - current;
    }
    return end - current;
  }

  if (current >= end) {
    return 0;
  }

  return end - current;
}

/**
 * Calculates slot duration in minutes.
 */
export function calculateSlotDurationMinutes(startTime: string, endTime: string): number {
  const start = parseTimeToMinutes(startTime);
  let end = parseTimeToMinutes(endTime);

  if (end < start) {
    end += 1440; // spans midnight
  }

  return end - start;
}

/**
 * Formats duration in minutes to readable hours (e.g. 90m -> 1.5h, 45m -> 45m).
 */
export function formatMinutesToHours(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = minutes / 60;
  return hours % 1 === 0 ? `${hours}h` : `${hours.toFixed(1)}h`;
}
