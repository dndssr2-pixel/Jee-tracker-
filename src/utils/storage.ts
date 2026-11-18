import { AppState } from '../types';
import { getStarterAppState } from './starterData';

export const STORAGE_KEY = 'jee_tracker_data_v2';

/**
 * Loads AppState from localStorage. If empty or corrupted, initializes and returns starter preset.
 */
export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getStarterAppState();
      saveAppState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      const initial = getStarterAppState();
      saveAppState(initial);
      return initial;
    }

    const starter = getStarterAppState();
    return {
      timetable: { ...starter.timetable, ...(parsed.timetable || {}) },
      dailyRoutines: parsed.dailyRoutines || {},
      dailyLogs: parsed.dailyLogs || {},
      backlogs: Array.isArray(parsed.backlogs) ? parsed.backlogs : starter.backlogs,
      settings: { ...starter.settings, ...(parsed.settings || {}) },
    };
  } catch (error) {
    console.error('Failed to parse state from localStorage, falling back to starter preset:', error);
    const initial = getStarterAppState();
    saveAppState(initial);
    return initial;
  }
}

/**
 * Saves AppState to localStorage.
 */
export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

/**
 * Serializes state to pretty JSON string for backup export.
 */
export function exportDataAsJSON(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Parses and validates an imported JSON string into AppState.
 */
export function importDataFromJSON(jsonString: string): AppState {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JEE Tracker backup file format');
  }

  const starter = getStarterAppState();
  return {
    timetable: { ...starter.timetable, ...(parsed.timetable || {}) },
    dailyRoutines: parsed.dailyRoutines || {},
    dailyLogs: parsed.dailyLogs || {},
    backlogs: Array.isArray(parsed.backlogs) ? parsed.backlogs : starter.backlogs,
    settings: { ...starter.settings, ...(parsed.settings || {}) },
  };
}

/**
 * Triggers a browser file download of the JSON backup.
 */
export function downloadBackupFile(state: AppState): void {
  const jsonStr = exportDataAsJSON(state);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `jee-aspirant-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
