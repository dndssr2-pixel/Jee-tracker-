import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RotateCcw,
  Sparkles,
  BookOpen,
  ListTodo
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppState, DateRoutineSlot, DailyRoutineRecord, DayOfWeek, BacklogItem } from '../types';
import ProgressBar from './ProgressBar';
import ActiveSlotCard from './ActiveSlotCard';
import { SUBJECT_BADGES } from './TimetablePlanner';
import { 
  getTodayDateString, 
  getDayOfWeekFromDate, 
  getCurrentTime24, 
  isSlotActive, 
  formatTo12Hour, 
  calculateSlotDurationMinutes, 
  formatMinutesToHours,
  shiftDateString
} from '../utils/time';

interface TodayRoutineProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  selectedDate?: string;
}

export default function TodayRoutine({ state, onUpdateState, selectedDate: initialDate }: TodayRoutineProps) {
  const [currentDate, setCurrentDate] = useState(initialDate || getTodayDateString());
  const [currentTime, setCurrentTime] = useState(getCurrentTime24());

  // Keep live time ticking every 30 seconds and handle midnight rollover
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime24());
      if (!initialDate) {
        const todayStr = getTodayDateString();
        setCurrentDate((prev) => (prev !== todayStr ? todayStr : prev));
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [initialDate]);

  const dayOfWeek = getDayOfWeekFromDate(currentDate);
  const isToday = currentDate === getTodayDateString();

  // Retrieve or initialize date routine record
  const existingRecord = state.dailyRoutines[currentDate];
  const slots: DateRoutineSlot[] = existingRecord
    ? existingRecord.slots
    : (state.timetable[dayOfWeek] || []).map((s) => ({
        ...s,
        status: 'pending',
      }));

  // Update routine in state if record wasn't present
  const updateRoutineSlots = (newSlots: DateRoutineSlot[]) => {
    onUpdateState((prev) => ({
      ...prev,
      dailyRoutines: {
        ...prev.dailyRoutines,
        [currentDate]: {
          date: currentDate,
          dayOfWeek,
          slots: newSlots,
        },
      },
    }));
  };

  const handleUpdateStatus = (slotId: string, newStatus: 'completed' | 'in_progress' | 'backlog' | 'pending') => {
    const targetSlot = slots.find((s) => s.id === slotId);

    // If un-marking a backlog, remove orphaned item from backlogs
    if (targetSlot && targetSlot.status === 'backlog' && newStatus !== 'backlog') {
      onUpdateState((prev) => ({
        ...prev,
        backlogs: prev.backlogs.filter(
          (b) => !(b.createdDate === currentDate && b.taskTitle === targetSlot.title)
        ),
      }));
    }

    const updated = slots.map((s) => {
      if (s.id === slotId) {
        return {
          ...s,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      }
      return s;
    });

    // If moving to backlog, create item in backlogs array if not already present
    if (newStatus === 'backlog' && targetSlot) {
      onUpdateState((prev) => {
        const alreadyExists = prev.backlogs.some(
          (b) => b.createdDate === currentDate && b.taskTitle === targetSlot.title
        );
        if (alreadyExists) return prev;

        const newBacklog: BacklogItem = {
          id: `backlog-${Date.now()}`,
          createdDate: currentDate,
          subject: targetSlot.subject,
          taskTitle: targetSlot.title,
          originalSlotTime: `${formatTo12Hour(targetSlot.startTime)} - ${formatTo12Hour(targetSlot.endTime)}`,
          assignedForSunday: true,
          resolved: false,
          notes: targetSlot.notes,
        };

        return {
          ...prev,
          backlogs: [newBacklog, ...prev.backlogs],
        };
      });
    }

    updateRoutineSlots(updated);

    // Check if all slots are completed
    const completedCount = updated.filter((s) => s.status === 'completed').length;
    if (completedCount === updated.length && updated.length > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti non-fatal in test environment
      }
    }
  };

  // Find active slot
  const activeSlot = isToday
    ? slots.find((s) => isSlotActive(s.startTime, s.endTime, currentTime) && s.status !== 'completed') || null
    : null;

  const completedCount = slots.filter((s) => s.status === 'completed').length;
  const totalSlots = slots.length;

  const changeDateBy = (days: number) => {
    setCurrentDate((prev) => shiftDateString(prev, days));
  };

  // Sunday assigned backlogs checklist
  const sundayAssignedBacklogs = state.backlogs.filter((b) => b.assignedForSunday && !b.resolved);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Date Navigation & Summary Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100">
                  {dayOfWeek}, {currentDate}
                </h2>
                {isToday && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                    TODAY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily Routine Tracker & Active Task Execution
              </p>
            </div>
          </div>

          {/* Date switch buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <button
              onClick={() => changeDateBy(-1)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Previous Day"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(getTodayDateString())}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => changeDateBy(1)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Next Day"
              aria-label="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="mt-5">
          <ProgressBar completed={completedCount} total={totalSlots} />
        </div>
      </div>

      {/* Active Slot Banner (if today) */}
      {isToday && (
        <ActiveSlotCard
          slot={activeSlot}
          currentTime={currentTime}
          onMarkDone={(id) => handleUpdateStatus(id, 'completed')}
          onMarkBacklog={(id) => handleUpdateStatus(id, 'backlog')}
        />
      )}

      {/* Embedded Sunday Backlog Catch-up Banner */}
      {dayOfWeek === 'Sunday' && sundayAssignedBacklogs.length > 0 && (
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Sunday Backlog Catch-Up Target ({sundayAssignedBacklogs.length} pending items)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            These tasks were deferred during the week for Sunday revision clearance:
          </p>
          <div className="space-y-2">
            {sundayAssignedBacklogs.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200">{item.taskTitle}</span>
                  <span className="text-slate-400 ml-2">({item.subject})</span>
                </div>
                <button
                  onClick={() => {
                    onUpdateState((prev) => ({
                      ...prev,
                      backlogs: prev.backlogs.map((b) =>
                        b.id === item.id ? { ...b, resolved: true, resolvedDate: currentDate } : b
                      ),
                    }));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors text-[11px] font-semibold"
                >
                  Mark Resolved
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Routine Slots List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          {dayOfWeek}'s Schedule ({totalSlots} slots)
        </h3>

        {slots.length === 0 ? (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-10 text-center">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No slots defined in your timetable for {dayOfWeek}</p>
            <p className="text-xs text-slate-500 mt-1">
              Add slots in the Timetable Planner tab to populate this day's routine.
            </p>
          </div>
        ) : (
          slots.map((slot) => {
            const badge = SUBJECT_BADGES[slot.subject] || SUBJECT_BADGES['Self-Study'];
            const duration = calculateSlotDurationMinutes(slot.startTime, slot.endTime);
            const isCompleted = slot.status === 'completed';
            const isBacklog = slot.status === 'backlog';
            const isInProgress = slot.status === 'in_progress';

            return (
              <div
                key={slot.id}
                className={`border rounded-2xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-900/40 border-emerald-500/30 opacity-75'
                    : isBacklog
                    ? 'bg-slate-900/60 border-amber-500/30'
                    : isInProgress
                    ? 'bg-slate-900 border-indigo-500/50 shadow-md'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Time Range */}
                  <div className="min-w-[120px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center">
                    <div className="text-xs font-bold text-slate-200">
                      {formatTo12Hour(slot.startTime)}
                    </div>
                    <div className="text-[10px] text-slate-500">to {formatTo12Hour(slot.endTime)}</div>
                    <div className="text-[10px] text-indigo-400 font-medium mt-0.5">
                      {formatMinutesToHours(duration)}
                    </div>
                  </div>

                  {/* Task details */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {slot.subject}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      )}
                      {isBacklog && (
                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Sent to Backlog
                        </span>
                      )}
                      {isInProgress && (
                        <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> In Progress
                        </span>
                      )}
                    </div>
                    <h4
                      className={`text-sm font-semibold text-slate-100 ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {slot.title}
                    </h4>
                    {slot.notes && (
                      <p className="text-xs text-slate-400 mt-0.5">{slot.notes}</p>
                    )}
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleUpdateStatus(slot.id, isCompleted ? 'pending' : 'completed')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    }`}
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                    aria-label={isCompleted ? 'Completed' : 'Done'}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Completed' : 'Done'}</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(slot.id, isInProgress ? 'pending' : 'in_progress')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      isInProgress
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title="Mark In Progress"
                    aria-label="In Progress"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(slot.id, isBacklog ? 'pending' : 'backlog')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      isBacklog
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400'
                    }`}
                    title="Send to Backlog"
                    aria-label="Backlog"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
