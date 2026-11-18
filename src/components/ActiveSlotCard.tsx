import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, PlayCircle, Flame } from 'lucide-react';
import { DateRoutineSlot } from '../types';
import { SUBJECT_BADGES } from './TimetablePlanner';
import { formatTo12Hour, getMinutesRemaining, formatMinutesToHours, calculateSlotDurationMinutes } from '../utils/time';

interface ActiveSlotCardProps {
  slot: DateRoutineSlot | null;
  currentTime: string;
  onMarkDone: (slotId: string) => void;
  onMarkBacklog: (slotId: string) => void;
}

export default function ActiveSlotCard({
  slot,
  currentTime,
  onMarkDone,
  onMarkBacklog,
}: ActiveSlotCardProps) {
  if (!slot) {
    return (
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 text-center">
        <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Current Status</span>
        </div>
        <h3 className="text-sm font-semibold text-slate-200">No Scheduled Slot Active Right Now</h3>
        <p className="text-xs text-slate-400 mt-1">
          You are between study slots or have finished today's scheduled blocks. Great time for a quick break or self-study!
        </p>
      </div>
    );
  }

  const badge = SUBJECT_BADGES[slot.subject] || SUBJECT_BADGES['Self-Study'];
  const remaining = getMinutesRemaining(slot.endTime, currentTime, slot.startTime);
  const duration = calculateSlotDurationMinutes(slot.startTime, slot.endTime);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border-2 border-indigo-500/50 rounded-2xl p-5 shadow-xl shadow-indigo-950/30">
      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Active Study Slot Right Now
          </span>
        </div>

        {remaining > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-xs font-semibold text-indigo-300">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{remaining} min remaining</span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${badge.bg} ${badge.text} ${badge.border}`}>
              {slot.subject}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatTo12Hour(slot.startTime)} - {formatTo12Hour(slot.endTime)} ({formatMinutesToHours(duration)})
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">{slot.title}</h2>
          {slot.notes && <p className="text-xs text-slate-300 mt-1">{slot.notes}</p>}
        </div>

        {/* Quick status controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onMarkDone(slot.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            aria-label="Mark Active Slot Done"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark as Done
          </button>
          <button
            onClick={() => onMarkBacklog(slot.id)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
            aria-label="Send to Backlog"
          >
            <AlertTriangle className="w-4 h-4" /> Backlog
          </button>
        </div>
      </div>
    </div>
  );
}
