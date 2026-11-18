import { AppState, DayOfWeek, TimeSlot } from '../types';

export function createDefaultWeekdaySlots(day: DayOfWeek): TimeSlot[] {
  return [
    {
      id: `${day}-1`,
      dayOfWeek: day,
      startTime: '06:00',
      endTime: '07:30',
      subject: 'Physics',
      title: 'Mechanics & Formula Recall (HC Verma)',
      notes: 'Focus on rotational dynamics & circular motion key problems',
    },
    {
      id: `${day}-2`,
      dayOfWeek: day,
      startTime: '08:00',
      endTime: '13:30',
      subject: 'School',
      title: 'School / Self-Study Block 1',
      notes: 'Class 11 CBSE theory, laboratory practicals, or self-study',
    },
    {
      id: `${day}-3`,
      dayOfWeek: day,
      startTime: '14:00',
      endTime: '15:30',
      subject: 'Chemistry',
      title: 'Physical & Inorganic Chemistry NCERT',
      notes: 'Thermodynamics & Chemical Bonding NCERT in-text questions',
    },
    {
      id: `${day}-4`,
      dayOfWeek: day,
      startTime: '16:00',
      endTime: '18:30',
      subject: 'Coaching',
      title: 'JEE Coaching Class / Core Concept Lectures',
      notes: 'Live lecture / coaching batch session',
    },
    {
      id: `${day}-5`,
      dayOfWeek: day,
      startTime: '19:00',
      endTime: '20:30',
      subject: 'Mathematics',
      title: 'Coordinate Geometry / Algebra Practice',
      notes: 'Straight Lines & Conic Sections DPP sheet 30 questions',
    },
    {
      id: `${day}-6`,
      dayOfWeek: day,
      startTime: '21:00',
      endTime: '22:30',
      subject: 'Self-Study',
      title: 'Daily Practice Problems (DPP) & Doubt Solving',
      notes: 'Solve 20 timed questions from today coaching topics',
    },
    {
      id: `${day}-7`,
      dayOfWeek: day,
      startTime: '22:30',
      endTime: '23:00',
      subject: 'Revision',
      title: 'Daily Log & Tomorrow Planning',
      notes: 'Log solved questions, check backlogs, sleep on time',
    },
  ];
}

export function createDefaultWeekendSlots(day: 'Saturday' | 'Sunday'): TimeSlot[] {
  if (day === 'Saturday') {
    return [
      {
        id: `${day}-1`,
        dayOfWeek: day,
        startTime: '06:30',
        endTime: '09:00',
        subject: 'Physics',
        title: 'Physics Advanced Problem Solving (HC Verma / Irodov)',
        notes: 'Target 25 high difficulty problems',
      },
      {
        id: `${day}-2`,
        dayOfWeek: day,
        startTime: '09:30',
        endTime: '12:30',
        subject: 'Mathematics',
        title: 'Maths Advanced DPP & Mock Paper Section',
        notes: 'Calculus / Trigonometry timed drill',
      },
      {
        id: `${day}-3`,
        dayOfWeek: day,
        startTime: '14:00',
        endTime: '17:00',
        subject: 'Chemistry',
        title: 'Organic Chemistry Reaction Mechanisms',
        notes: 'GOC and Hydrocarbons synthesis pathways',
      },
      {
        id: `${day}-4`,
        dayOfWeek: day,
        startTime: '18:00',
        endTime: '20:30',
        subject: 'Coaching',
        title: 'Doubt Discussion & Module Review',
        notes: 'Coaching weekend module review',
      },
      {
        id: `${day}-5`,
        dayOfWeek: day,
        startTime: '21:00',
        endTime: '22:30',
        subject: 'Revision',
        title: 'Weekly Short Notes Consolidation',
        notes: 'Update formula notebook for all 3 subjects',
      },
    ];
  }

  // Sunday: Focused on Mock Test, Test Analysis & Backlog Clearance
  return [
    {
      id: `${day}-1`,
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '12:00',
      subject: 'Self-Study',
      title: 'JEE Main/Advanced 3-Hour Mock Test',
      notes: 'Simulate real exam condition, no phone, full 300 marks test',
    },
    {
      id: `${day}-2`,
      dayOfWeek: day,
      startTime: '13:00',
      endTime: '15:30',
      subject: 'Revision',
      title: 'Detailed Mock Test Analysis & Mistake Notebook',
      notes: 'Identify silly mistakes, conceptual errors, and unattempted questions',
    },
    {
      id: `${day}-3`,
      dayOfWeek: day,
      startTime: '16:00',
      endTime: '19:30',
      subject: 'Revision',
      title: 'Revision & Backlog Clearance',
      notes: 'Clear all tasks queued from the week backlog box',
    },
    {
      id: `${day}-4`,
      dayOfWeek: day,
      startTime: '20:30',
      endTime: '22:00',
      subject: 'Self-Study',
      title: 'Next Week Preparation & Target Setting',
      notes: 'Set weekly goals for Physics, Chem, and Maths chapters',
    },
  ];
}

/**
 * Returns full Class 11 JEE preset timetable when user clicks "Load JEE Preset".
 */
export function getJEEPresetTimetable(): Record<DayOfWeek, TimeSlot[]> {
  return {
    Monday: createDefaultWeekdaySlots('Monday'),
    Tuesday: createDefaultWeekdaySlots('Tuesday'),
    Wednesday: createDefaultWeekdaySlots('Wednesday'),
    Thursday: createDefaultWeekdaySlots('Thursday'),
    Friday: createDefaultWeekdaySlots('Friday'),
    Saturday: createDefaultWeekendSlots('Saturday'),
    Sunday: createDefaultWeekendSlots('Sunday'),
  };
}

/**
 * Returns completely fresh clean application state with zero pre-added tasks, zero streak, and zero demo backlogs.
 */
export function getStarterAppState(): AppState {
  return {
    timetable: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
    dailyRoutines: {},
    dailyLogs: {},
    backlogs: [],
    settings: {
      studentName: 'Class 11 Aspirant',
      targetYear: '2027',
      streakDays: 0,
      lastActiveDate: '',
      dailyStudyTargetHours: 8,
      dailyQuestionTarget: 60,
    },
  };
}
