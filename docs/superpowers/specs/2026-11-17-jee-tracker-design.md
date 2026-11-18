# Design Document: Class 11 JEE Aspirant Daily Routine & Timetable Tracker

**Date:** 2026-11-17  
**Status:** In Review  
**Target User:** Class 11 IIT-JEE Aspirant  

---

## 1. Intent and the "Why"
Preparing for IIT-JEE in Class 11 is one of the most critical phases in an engineering aspirant's academic journey. Students must juggle deep theoretical understanding, rigorous problem solving (DPPs, modules, HC Verma, Irodov, MS Chouhan, etc.), coaching classes, school, and revision, while preventing backlogs. 

The core problems students face:
1. **Unrealistic or rigid schedules:** Static paper timetables or generic calendar apps don't reflect daily reality and fail when a student falls behind.
2. **Lack of accountability on output:** Just sitting at a desk isn't enough; JEE aspirants need to track actual output (number of questions solved, hours spent on Physics vs. Chemistry vs. Mathematics).
3. **Accumulating backlogs:** Missed tasks slip away and become overwhelming if not cataloged and scheduled for catch-up.

This application provides a focused, distraction-free, offline-first dashboard designed specifically for a Class 11 JEE aspirant to define a day-wise weekly timetable, execute and track the routine daily in real-time, log daily study metrics (hours, question counts, reflections), and manage backlogs.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Day-Wise Fixed Timetable Management:** 
  - Define custom time blocks for each day of the week (Monday through Sunday) with start time, end time, subject/category (Physics, Chemistry, Mathematics, Coaching, School, Self-Study, Revision, Break), and specific task descriptions (e.g., "HC Verma Rotational Motion Ex 1-25").
  - Provide a 1-click "Copy schedule to other weekdays" action for quick setup.
  - Preload a thoughtful Class 11 JEE Aspirant starter template so first-time users don't start with a blank screen.
- **Daily Routine Execution & Tracking:**
  - Automatically detect the current day of the week and display today's routine.
  - Real-time "Active Now" slot indicator with countdown timer and highlight.
  - 1-click status logging per slot: `Completed` (✅), `In Progress` (⏳), or `Missed / Backlog` (⚠️).
  - Real-time daily progress bar showing percentage of routine completed.
- **JEE Daily Performance Logger:**
  - Subject-wise study hours breakdown (Physics, Chemistry, Maths, Revision).
  - Daily problem-solving counter (e.g. Target: 60 questions, Solved: 52).
  - Energy & Focus rating (1 to 5 stars).
  - Daily reflection, notes, and key takeaways journal.
  - Daily log history view to review past days and consistency.
- **Smart Backlog Manager:**
  - Tasks marked as "Missed / Backlog" in the daily routine automatically route to a dedicated Backlog Manager.
  - Allows the student to assign backlogs to dedicated weekend revision slots or mark them resolved once finished.
- **Analytics & Consistency Tracking:**
  - Study streak counter (consecutive days of completed targets).
  - Weekly study hours trend.
  - PCM balance chart (donut/pie visualization showing time split between Physics, Chemistry, and Mathematics).
- **Data Persistence & Portability:**
  - Instant offline auto-save to browser `localStorage`.
  - JSON Export and Import features to create backups or move data between devices.

### Non-Goals
- Mandatory account creation or cloud authentication requiring a hosted database server.
- Built-in video lecture streaming, PDF module reading, or heavy LMS features.
- Distracting social feeds or competitive leaderboards that induce unnecessary anxiety.

### Anti-Goals
- Demoralizing user experiences: If a student misses a 2-hour slot, the app shouldn't flash red failure banners; instead, it gently prompts them to push the task to the Backlog Manager for Sunday catch-up.
- Clunky enterprise UI: The app must feel sleek, modern, fast, and dark-mode first, evoking focus and flow.

---

## 3. Approaches Considered & Selected Architecture

### Approach 1 (Selected): Modern Responsive Web App (React + Vite + Tailwind CSS + Lucide Icons + LocalStorage)
- **Why selected:** Instant startup, runs smoothly in any browser (desktop or mobile), zero backend server overhead, zero login barriers, offline capable, and simple to export/import JSON data.
- **Trade-off:** Data is saved locally in the browser storage, which is solved by providing single-click JSON backup/restore.

### Approach 2: Full-Stack Web App (React + Node.js/Express + SQLite)
- **Why rejected:** Requires running and maintaining a persistent Node server process and database file, which introduces unnecessary friction for a single-student personal productivity tool.

### Approach 3: Python Desktop App (PyQt / CustomTkinter)
- **Why rejected:** Rigid desktop window UI, cannot be opened on mobile devices or easily hosted on GitHub Pages/Vercel if desired, and harder to customize responsive layouts.

---

## 4. User Interface & Feature Breakdown

### A. Navigation & Header
- **App Title & JEE Motivation Badge:** e.g., "JEE 2026/2027 Aspirant Hub" with streak counter (🔥 X Days Streak).
- **Current Day & Time Display:** Shows real-time Indian Standard Time (IST) clock and day of week.
- **View Tabs:**
  1. 📅 **Today's Routine** (Daily execution dashboard)
  2. 🕒 **Timetable Planner** (Day-wise weekly master timetable setup)
  3. 📝 **Daily Logger & Journal** (End-of-day study log, questions count, PCM hours)
  4. 📋 **Backlog Box** (Manage missed tasks and weekend catch-up)
  5. 📊 **Progress & Analytics** (Weekly hours, PCM balance chart, streak history)
  6. ⚙️ **Settings / Backup** (Export/Import JSON, reset to default template)

### B. Today's Routine View
- **Summary Header:**
  - Date & Day indicator.
  - Daily completion rate (e.g. `6/8 tasks done • 75%`).
  - Active task banner: Highlights what the student should be studying right now, remaining minutes, and quick buttons to mark `Done`, `Skipped (Send to Backlog)`, or `Extend`.
- **Timeline / Slot Cards:**
  - Card for each time slot with:
    - Time range (e.g. `06:00 AM - 07:30 AM`).
    - Subject tag with color coding (Physics = Emerald, Chemistry = Amber, Maths = Blue, Coaching = Purple, Revision = Indigo, Break = Gray).
    - Task title & description.
    - Status pill (`Pending`, `Done`, `In Progress`, `Backlog`).
    - Quick actions: Mark Done, Push to Backlog, Edit task for today.

### C. Timetable Planner (Master Weekly Schedule)
- **Day Selector Tabs:** Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
- **Actions:**
  - "Add Time Slot": Modal or inline form with Start Time, End Time, Subject, Category, Task Name, Priority.
  - "Copy Schedule": Copy current day's slots to (e.g.) all weekdays or select specific days.
  - "Load JEE Preset": One-click option to load a battle-tested Class 11 JEE schedule (School/Dummy + Coaching + Self Study balance).
  - Edit / Delete slot controls.
  - Total planned study hours calculation per day.

### D. Daily Logger & Performance Journal
- **Study Log Inputs:**
  - Physics hours studied (number/slider).
  - Chemistry hours studied.
  - Mathematics hours studied.
  - Revision / Mock Test hours.
  - **Questions Solved Target Tracker:** Daily question goal (e.g. 50) and actual questions solved (e.g. 45), broken down by PCM.
  - **Focus & Energy Rating:** 1 to 5 stars.
  - **Daily Notes / Reflection:** Markdown/text area for "What went well", "Where did I waste time", "Key formulas/concepts revised".
- **Log Submission:** Saves the log for today (or selected date) and updates analytics.

### E. Backlog Manager
- List of tasks that were skipped or flagged as backlog.
- Shows origin date and subject.
- Actions:
  - "Schedule for Sunday Catch-up"
  - "Mark as Resolved"
  - "Archive / Discard"
- Backlog severity gauge (e.g., 3 active backlogs - manageable!).

### F. Analytics & Insights
- **Weekly Total Study Hours:** Bar chart comparing target vs. actual hours for the past 7 days.
- **PCM Balance (Donut Chart):** Visual ratio of Physics vs. Chemistry vs. Mathematics vs. Revision to prevent neglecting any one subject.
- **Questions Solved Counter:** Total questions solved this week/month.
- **Consistency Calendar / Streak:** Grid showing active study days.

---

## 5. Data Model & Storage

All data is structured in JSON and stored in `localStorage` under `jee_tracker_data_v1`.

### Architectural Decisions (Builder Calls)
1. **Master Timetable vs. Date-Specific Routines (Decoupled Snapshots):**
   - The master weekly timetable serves as the recurring blueprint.
   - Each date has an independent `DailyRoutineRecord` with its own instance of slots (`DateRoutineSlot[]`). When a date is first viewed or initialized, it clones from that weekday's master timetable template.
   - Any single-day modifications (e.g. extending a slot or editing a task today) only affect that date's record. Updating the master timetable only applies to future dates that haven't been customized, preserving historical integrity.
2. **Harmonized Study Hours & Analytics Pipeline:**
   - As the student marks routine slots as `Completed`, the system automatically tallies completed study hours by subject.
   - In the **Daily Logger**, these tallied hours automatically pre-populate the input fields (e.g., Physics: 2.5h, Math: 2h), allowing the student to quickly confirm or tweak them, enter their solved question counts, and write notes.
   - The finalized `DailyLogRecord` is the primary source of truth for Analytics charts, with real-time routine completions serving as the fallback if a journal hasn't been submitted yet.
3. **Backlog Catch-Up Lifecycle:**
   - Missed or flagged slots generate a `BacklogItem`.
   - In the **Backlog Box**, students can toggle "Queue for Sunday Catch-up".
   - On Sundays, the designated "Revision & Backlog Clearance" time slot surfaces this active catch-up checklist. Checking an item off updates both the Sunday routine slot and marks the backlog item as resolved (`resolved: true`).

```typescript
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
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
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
  dayOfWeek: string;
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

export interface AppState {
  timetable: Record<string, TimeSlot[]>; // Day -> TimeSlot[]
  dailyRoutines: Record<string, DailyRoutineRecord>; // Date -> DailyRoutineRecord
  dailyLogs: Record<string, DailyLogRecord>; // Date -> DailyLogRecord
  backlogs: BacklogItem[];
  settings: {
    studentName: string;
    targetYear: string;
    streakDays: number;
    lastActiveDate: string;
    soundEnabled: boolean;
  };
}
```

---

## 6. Default Class 11 JEE Preset
To give immediate value, the app will include a pre-configured template:
- `06:00 - 07:30`: Morning Revision & Formula Recall (Physics / Chem formulas)
- `08:00 - 13:30`: School / Dummy School / Self-Study Slot 1
- `14:00 - 15:30`: Chemistry Theory & NCERT / Notes
- `16:00 - 18:30`: Coaching Class / Core Concept Lectures
- `19:00 - 20:30`: Physics Practice (HC Verma / Module Exercises)
- `21:00 - 22:30`: Mathematics Problem Solving (Algebra / Coordinate Geometry DPP)
- `22:30 - 23:00`: Daily Review, Backlog Check & Next Day Planning

---

## 7. What is Left to the Builder
- Component composition, styling with Tailwind CSS (dark mode aesthetics, high contrast, clean typography, glassmorphism accents).
- Audio/sound feedback or visual celebration (confetti on 100% daily completion).
- Responsive layout adjustments for mobile/tablet screens.
- Sample data seeding logic on initial startup.
