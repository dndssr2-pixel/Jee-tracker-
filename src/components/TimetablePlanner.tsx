import React, { useState } from 'react';
import { 
  Plus, 
  Copy, 
  RotateCcw, 
  Clock, 
  Edit2, 
  Trash2, 
  Calendar,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { AppState, DayOfWeek, Subject, TimeSlot } from '../types';
import SlotModal from './SlotModal';
import ConfirmModal from './ConfirmModal';
import { formatTo12Hour, calculateSlotDurationMinutes, formatMinutesToHours } from '../utils/time';
import { getJEEPresetTimetable } from '../utils/starterData';

interface TimetablePlannerProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const SUBJECT_BADGES: Record<Subject, { bg: string; text: string; border: string }> = {
  Physics: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Chemistry: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  Mathematics: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  Coaching: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  School: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  Revision: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Self-Study': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  Break: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
};

export default function TimetablePlanner({ state, onUpdateState }: TimetablePlannerProps) {
  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentSlots = [...(state.timetable[activeDay] || [])].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalMinutes = currentSlots.reduce((acc, slot) => {
    return acc + calculateSlotDurationMinutes(slot.startTime, slot.endTime);
  }, 0);

  const handleSaveSlot = (slotData: Omit<TimeSlot, 'id'>, existingId?: string) => {
    onUpdateState((prev) => {
      const daySlots = [...(prev.timetable[activeDay] || [])];
      if (existingId) {
        const index = daySlots.findIndex((s) => s.id === existingId);
        if (index !== -1) {
          daySlots[index] = { ...slotData, id: existingId };
        }
      } else {
        const newSlot: TimeSlot = {
          ...slotData,
          id: `${activeDay}-${Date.now()}`,
        };
        daySlots.push(newSlot);
      }
      return {
        ...prev,
        timetable: {
          ...prev.timetable,
          [activeDay]: daySlots,
        },
      };
    });
  };

  const handleDeleteSlot = () => {
    if (!slotToDelete) return;
    onUpdateState((prev) => ({
      ...prev,
      timetable: {
        ...prev.timetable,
        [activeDay]: (prev.timetable[activeDay] || []).filter((s) => s.id !== slotToDelete),
      },
    }));
    setSlotToDelete(null);
  };

  const handleCopyToWeekdays = () => {
    onUpdateState((prev) => {
      const sourceSlots = prev.timetable[activeDay] || [];
      const weekdays: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const updatedTimetable = { ...prev.timetable };

      weekdays.forEach((day) => {
        if (day !== activeDay) {
          updatedTimetable[day] = sourceSlots.map((s, idx) => ({
            ...s,
            id: `${day}-${Date.now()}-${idx}`,
            dayOfWeek: day,
          }));
        }
      });

      return {
        ...prev,
        timetable: updatedTimetable,
      };
    });
    setShowCopyConfirm(false);
  };

  const handleResetPreset = () => {
    const preset = getJEEPresetTimetable();
    onUpdateState((prev) => ({
      ...prev,
      timetable: preset,
    }));
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Controls & Day Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-100">Day-Wise Master Timetable</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure your fixed daily schedule. Changes here set the recurring weekly timetable template.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCopyConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Copy current day slots to Monday through Friday"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" /> Copy to Weekdays
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Reset all days to standard Class 11 JEE preset"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Load JEE Preset
            </button>

            <button
              onClick={() => {
                setEditingSlot(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Time Slot
            </button>
          </div>
        </div>

        {/* Day Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 scrollbar-none">
          {DAYS.map((day) => {
            const count = state.timetable[day]?.length || 0;
            const isSelected = activeDay === day;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{day}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-indigo-700/80 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots Summary Header */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400">
        <div>
          Showing schedule for <span className="font-semibold text-indigo-400">{activeDay}</span>: {currentSlots.length} slot{currentSlots.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Clock className="w-3.5 h-3.5 text-indigo-400" /> Total Scheduled: {formatMinutesToHours(totalMinutes)}
        </div>
      </div>

      {/* Slots Listing */}
      {currentSlots.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No time slots added for {activeDay}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Plan your study sessions, coaching hours, and revision slots for {activeDay}.
          </p>
          <button
            onClick={() => {
              setEditingSlot(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add First Slot
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {currentSlots.map((slot) => {
            const badge = SUBJECT_BADGES[slot.subject] || SUBJECT_BADGES['Self-Study'];
            const duration = calculateSlotDurationMinutes(slot.startTime, slot.endTime);
            return (
              <div
                key={slot.id}
                className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Time Block */}
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
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100">{slot.title}</h4>
                    {slot.notes && (
                      <p className="text-xs text-slate-400 mt-0.5">{slot.notes}</p>
                    )}
                  </div>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingSlot(slot);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit slot"
                    aria-label="Edit slot"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSlotToDelete(slot.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete slot"
                    aria-label="Delete slot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slot Modal */}
      <SlotModal
        isOpen={isModalOpen}
        day={activeDay}
        initialSlot={editingSlot}
        onSave={handleSaveSlot}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSlot(null);
        }}
      />

      {/* Confirm Slot Deletion */}
      <ConfirmModal
        isOpen={!!slotToDelete}
        title="Delete Time Slot"
        message="Are you sure you want to remove this time slot from your master timetable?"
        confirmLabel="Delete"
        isDestructive={true}
        onConfirm={handleDeleteSlot}
        onCancel={() => setSlotToDelete(null)}
      />

      {/* Confirm Copy to Weekdays */}
      <ConfirmModal
        isOpen={showCopyConfirm}
        title="Copy to Weekdays"
        message={`This will overwrite Tuesday through Friday timetables with your ${activeDay} schedule. Do you wish to continue?`}
        confirmLabel="Overwrite Weekdays"
        onConfirm={handleCopyToWeekdays}
        onCancel={() => setShowCopyConfirm(false)}
      />

      {/* Confirm Reset to Preset */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset to JEE Preset"
        message="This will reset all days to the default Class 11 JEE Aspirant schedule template. Any custom slots will be replaced."
        confirmLabel="Reset Timetable"
        isDestructive={true}
        onConfirm={handleResetPreset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
