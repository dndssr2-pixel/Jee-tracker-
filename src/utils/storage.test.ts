import { describe, it, expect, beforeEach } from 'vitest';
import { loadAppState, saveAppState, exportDataAsJSON, importDataFromJSON, STORAGE_KEY } from './storage';

describe('Storage Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads starter preset when storage is empty', () => {
    const state = loadAppState();
    expect(Array.isArray(state.timetable.Monday)).toBe(true);
    expect(state.settings.targetYear).toBe('2027');
    expect(state.settings.streakDays).toBe(0);
  });

  it('persists and retrieves updated state', () => {
    const state = loadAppState();
    state.settings.studentName = 'Arjun Sharma';
    saveAppState(state);
    const loaded = loadAppState();
    expect(loaded.settings.studentName).toBe('Arjun Sharma');
  });

  it('exports state as JSON string and parses back correctly', () => {
    const state = loadAppState();
    const jsonStr = exportDataAsJSON(state);
    const imported = importDataFromJSON(jsonStr);
    expect(imported.settings.targetYear).toBe(state.settings.targetYear);
    expect(imported.timetable.Sunday.length).toBe(state.timetable.Sunday.length);
  });

  it('recovers gracefully from corrupted JSON in storage', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid_json}');
    const state = loadAppState();
    expect(Array.isArray(state.timetable.Monday)).toBe(true);
  });

  it('safely hydrates incomplete state missing dailyRoutines, dailyLogs, or backlogs', () => {
    const incompleteState = {
      timetable: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] },
      settings: { studentName: 'Test Student', targetYear: '2027', streakDays: 2, lastActiveDate: '2026-11-17', dailyStudyTargetHours: 8, dailyQuestionTarget: 60 }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incompleteState));
    const state = loadAppState();
    expect(state.dailyRoutines).toBeDefined();
    expect(state.dailyLogs).toBeDefined();
    expect(Array.isArray(state.backlogs)).toBe(true);
    expect(state.settings.studentName).toBe('Test Student');
  });
});
