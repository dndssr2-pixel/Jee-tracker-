import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Trash2, 
  Plus, 
  Filter, 
  Clock, 
  Check, 
  X,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AppState, BacklogItem, Subject } from '../types';
import { SUBJECT_BADGES } from './TimetablePlanner';
import { getTodayDateString } from '../utils/time';

interface BacklogManagerProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
}

export default function BacklogManager({ state, onUpdateState }: BacklogManagerProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [viewFilter, setViewFilter] = useState<'pending' | 'resolved'>('pending');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New manual backlog form
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<Subject>('Physics');
  const [newNotes, setNewNotes] = useState('');

  const backlogs = state.backlogs || [];
  const pendingBacklogs = backlogs.filter((b) => !b.resolved);
  const resolvedBacklogs = backlogs.filter((b) => b.resolved);

  const displayedList = (viewFilter === 'pending' ? pendingBacklogs : resolvedBacklogs).filter((b) => {
    if (selectedSubject === 'All') return true;
    return b.subject === selectedSubject;
  });

  const handleToggleSunday = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      backlogs: prev.backlogs.map((b) =>
        b.id === id ? { ...b, assignedForSunday: !b.assignedForSunday } : b
      ),
    }));
  };

  const handleResolve = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      backlogs: prev.backlogs.map((b) =>
        b.id === id ? { ...b, resolved: true, resolvedDate: getTodayDateString() } : b
      ),
    }));
  };

  const handleUnresolve = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      backlogs: prev.backlogs.map((b) =>
        b.id === id ? { ...b, resolved: false, resolvedDate: undefined } : b
      ),
    }));
  };

  const handleDelete = (id: string) => {
    onUpdateState((prev) => ({
      ...prev,
      backlogs: prev.backlogs.filter((b) => b.id !== id),
    }));
  };

  const handleAddManualBacklog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BacklogItem = {
      id: `manual-backlog-${Date.now()}`,
      createdDate: getTodayDateString(),
      subject: newSubject,
      taskTitle: newTitle.trim(),
      assignedForSunday: true,
      resolved: false,
      notes: newNotes.trim() || undefined,
    };

    onUpdateState((prev) => ({
      ...prev,
      backlogs: [newItem, ...prev.backlogs],
    }));

    setNewTitle('');
    setNewNotes('');
    setIsAddOpen(false);
  };

  const sundayAssignedCount = pendingBacklogs.filter((b) => b.assignedForSunday).length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header and Stats */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Smart Backlog Box</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Catch up on missed tasks without stress. Queue them for Sunday's revision slot.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Past Backlog
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{pendingBacklogs.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active Backlogs</div>
          </div>
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-indigo-400">{sundayAssignedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Queued for Sunday</div>
          </div>
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-emerald-400">{resolvedBacklogs.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Cleared Backlogs</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewFilter === 'pending'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending ({pendingBacklogs.length})
          </button>
          <button
            onClick={() => setViewFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewFilter === 'resolved'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resolved ({resolvedBacklogs.length})
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {['All', 'Physics', 'Chemistry', 'Mathematics', 'Revision'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedSubject === sub
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Backlog Items List */}
      {displayedList.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-200">
            {viewFilter === 'pending'
              ? 'No pending backlogs found!'
              : 'No resolved backlogs in history.'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            {viewFilter === 'pending'
              ? 'Outstanding work! Sticking to your daily routine keeps backlogs at zero.'
              : 'Cleared tasks will appear here as you resolve them.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedList.map((item) => {
            const badge = SUBJECT_BADGES[item.subject] || SUBJECT_BADGES['Self-Study'];

            return (
              <div
                key={item.id}
                className={`border rounded-2xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  item.resolved
                    ? 'bg-slate-900/40 border-emerald-500/20 opacity-70'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {item.subject}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Logged on {item.createdDate}
                    </span>
                    {item.originalSlotTime && (
                      <span className="text-[10px] text-slate-500">
                        ({item.originalSlotTime})
                      </span>
                    )}
                    {item.assignedForSunday && !item.resolved && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Sunday Catch-Up
                      </span>
                    )}
                  </div>
                  <h4
                    className={`text-sm font-semibold text-slate-100 ${
                      item.resolved ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {item.taskTitle}
                  </h4>
                  {item.notes && <p className="text-xs text-slate-400 mt-1">{item.notes}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!item.resolved ? (
                    <>
                      <button
                        onClick={() => handleToggleSunday(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          item.assignedForSunday
                            ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                        title="Toggle assignment for Sunday catch-up"
                        aria-label="Queue for Sunday"
                      >
                        {item.assignedForSunday ? 'In Sunday Queue ✓' : 'Queue for Sunday'}
                      </button>

                      <button
                        onClick={() => handleResolve(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all"
                        aria-label="Resolve"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleUnresolve(item.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Reopen backlog"
                    >
                      Reopen
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete item"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Backlog Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-1">Add Existing Backlog</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add any pending chapter or module backlog you need to track.
            </p>

            <form onSubmit={handleAddManualBacklog} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Subject
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as Subject)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Revision">Revision</option>
                  <option value="Self-Study">Self-Study</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Backlog Task Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. HC Verma Rotational Dynamics Q15-30"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Notes / Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Revise parallel axis theorem before attempting"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                >
                  Add to Backlog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
