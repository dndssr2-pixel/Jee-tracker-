import React, { useState, useEffect } from 'react';
import { X, Clock, BookOpen, FileText, Moon } from 'lucide-react';
import { DayOfWeek, Subject, TimeSlot } from '../types';
import { parseTimeToMinutes } from '../utils/time';

interface SlotModalProps {
  isOpen: boolean;
  day: DayOfWeek;
  initialSlot?: TimeSlot | null;
  onSave: (slotData: Omit<TimeSlot, 'id'>, existingId?: string) => void;
  onClose: () => void;
}

const SUBJECTS: { value: Subject; label: string; color: string }[] = [
  { value: 'Physics', label: 'Physics', color: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' },
  { value: 'Chemistry', label: 'Chemistry', color: 'border-amber-500/50 text-amber-400 bg-amber-500/10' },
  { value: 'Mathematics', label: 'Mathematics', color: 'border-blue-500/50 text-blue-400 bg-blue-500/10' },
  { value: 'Coaching', label: 'Coaching Class', color: 'border-purple-500/50 text-purple-400 bg-purple-500/10' },
  { value: 'School', label: 'School Theory', color: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10' },
  { value: 'Revision', label: 'Revision / Mistake Notebook', color: 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10' },
  { value: 'Self-Study', label: 'Self-Study / DPP', color: 'border-teal-500/50 text-teal-400 bg-teal-500/10' },
  { value: 'Break', label: 'Break / Rest', color: 'border-slate-500/50 text-slate-400 bg-slate-500/10' },
];

export default function SlotModal({ isOpen, day, initialSlot, onSave, onClose }: SlotModalProps) {
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('07:30');
  const [subject, setSubject] = useState<Subject>('Physics');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialSlot) {
      setStartTime(initialSlot.startTime);
      setEndTime(initialSlot.endTime);
      setSubject(initialSlot.subject);
      setTitle(initialSlot.title);
      setNotes(initialSlot.notes || '');
    } else {
      setStartTime('06:00');
      setEndTime('07:30');
      setSubject('Physics');
      setTitle('');
      setNotes('');
    }
    setError('');
  }, [initialSlot, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a specific task or chapter title.');
      return;
    }
    if (!startTime || !endTime) {
      setError('Please select both start and end times.');
      return;
    }
    if (startTime === endTime) {
      setError('Start time and end time cannot be identical.');
      return;
    }

    onSave(
      {
        dayOfWeek: day,
        startTime,
        endTime,
        subject,
        title: title.trim(),
        notes: notes.trim(),
      },
      initialSlot?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-1">
          {initialSlot ? 'Edit Time Slot' : 'Create New Time Slot'}
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Configuring schedule for <span className="text-indigo-400 font-semibold">{day}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Start Time (24h)
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> End Time (24h)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {startTime && endTime && parseTimeToMinutes(endTime) < parseTimeToMinutes(startTime) && (
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Overnight Slot: Spans midnight into the next morning.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Subject / Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUBJECTS.map((sub) => (
                <button
                  type="button"
                  key={sub.value}
                  onClick={() => setSubject(sub.value)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    subject === sub.value
                      ? `${sub.color} ring-2 ring-indigo-500 shadow-md`
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {startTime && endTime && parseTimeToMinutes(endTime) < parseTimeToMinutes(startTime) && (
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Overnight Slot: Spans midnight into the next morning.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Task / Target Title
            </label>
            <input
              type="text"
              placeholder="e.g. HC Verma Rotational Dynamics Q1-25"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Target Details & Chapter Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Focus on torque balance problems and moment of inertia formulas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              {initialSlot ? 'Update Slot' : 'Save Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
