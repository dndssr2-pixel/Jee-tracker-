export type DayOfWeek = 
  | 'Monday' 
  | 'Tuesday' 
  | 'Wednesday' 
  | 'Thursday' 
  | 'Friday' 
  | 'Saturday' 
  | 'Sunday';

export type Subject = 
  | 'Physics' 
  | 'Chemistry' 
  | 'Mathematics' 
  | 'Coaching' 
  | 'School' 
  | 'Revision' 
  | 'Self-Study' 
  | 'Break';

export type SlotStatus = 'pending' | 'in_progress' | 'completed' | 'backlog';

export interface TimeSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "06:00" (24h format)
  endTime: string;   // "07:30"
  subject: Subject;
  title: string;     // e.g. "HC Verma Rotational Motion Ex 1-25"
  notes?: string;
}

export interface DateRoutineSlot extends TimeSlot {
  status: SlotStatus;
  actualDurationMinutes?: number;
  completedAt?: string;
}

export interface DailyRoutineRecord {
  date: string; // "YYYY-MM-DD"
  dayOfWeek: DayOfWeek;
  slots: DateRoutineSlot[];
}

export interface DailyLogRecord {
  date: string; // "YYYY-MM-DD"
  physicsHours: number;
  chemistryHours: number;
  mathsHours: number;
  revisionHours: number;
  otherHours: number;
  questionsTarget: number;
  questionsSolved: number;
  focusRating: number; // 1 - 5 stars
  notes: string;
  completedAt?: string;
}

export interface BacklogItem {
  id: string;
  createdDate: string;
  subject: Subject;
  taskTitle: string;
  originalSlotTime?: string;
  assignedForSunday: boolean;
  resolved: boolean;
  resolvedDate?: string;
  notes?: string;
}

export interface AppSettings {
  studentName: string;
  targetYear: string;
  streakDays: number;
  lastActiveDate: string;
  dailyStudyTargetHours: number;
  dailyQuestionTarget: number;
}

export interface AppState {
  timetable: Record<DayOfWeek, TimeSlot[]>;
  dailyRoutines: Record<string, DailyRoutineRecord>; // Date YYYY-MM-DD -> record
  dailyLogs: Record<string, DailyLogRecord>;         // Date YYYY-MM-DD -> log
  backlogs: BacklogItem[];
  settings: AppSettings;
}
