import { DailyRoutineRecord } from '../types';
import { calculateSlotDurationMinutes } from './time';

export interface RoutineTallyResult {
  physics: number;
  chemistry: number;
  maths: number;
  revision: number;
  other: number;
  total: number;
}

export function tallyRoutineStudyHours(routine?: DailyRoutineRecord): RoutineTallyResult {
  const result: RoutineTallyResult = {
    physics: 0,
    chemistry: 0,
    maths: 0,
    revision: 0,
    other: 0,
    total: 0,
  };

  if (!routine || !routine.slots) {
    return result;
  }

  routine.slots.forEach((slot) => {
    if (slot.status === 'completed') {
      const minutes = calculateSlotDurationMinutes(slot.startTime, slot.endTime);
      const hours = Math.round((minutes / 60) * 10) / 10;

      switch (slot.subject) {
        case 'Physics':
          result.physics += hours;
          break;
        case 'Chemistry':
          result.chemistry += hours;
          break;
        case 'Mathematics':
          result.maths += hours;
          break;
        case 'Revision':
          result.revision += hours;
          break;
        default:
          result.other += hours;
          break;
      }
      result.total += hours;
    }
  });

  // Normalize floating point
  result.physics = Number(result.physics.toFixed(1));
  result.chemistry = Number(result.chemistry.toFixed(1));
  result.maths = Number(result.maths.toFixed(1));
  result.revision = Number(result.revision.toFixed(1));
  result.other = Number(result.other.toFixed(1));
  result.total = Number(result.total.toFixed(1));

  return result;
}

/**
 * Calculates updated streak days based on difference between last active date and new log date.
 */
export function calculateUpdatedStreak(
  currentStreak: number,
  lastActiveDate: string,
  newLogDate: string
): number {
  if (!lastActiveDate) {
    return 1;
  }

  // Parse YYYY-MM-DD
  const [y1, m1, d1] = lastActiveDate.split('-').map(Number);
  const [y2, m2, d2] = newLogDate.split('-').map(Number);

  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);

  const diffTime = date2.getTime() - date1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Logging again on the same day
    return currentStreak;
  } else if (diffDays === 1) {
    // Consecutive day
    return currentStreak + 1;
  } else {
    // Missed days
    return 1;
  }
}
