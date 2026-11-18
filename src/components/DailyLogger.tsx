import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Target, 
  Star, 
  Sparkles, 
  Calendar, 
  Save, 
  RefreshCw, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { AppState, DailyLogRecord } from '../types';
import { tallyRoutineStudyHours, calculateUpdatedStreak } from '../utils/loggerCalculations';
import { getTodayDateString, getDayOfWeekFromDate, shiftDateString } from '../utils/time';

interface DailyLoggerProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  selectedDate?: string;
}

export default function DailyLogger({ state, onUpdateState, selectedDate: initialDate }: DailyLoggerProps) {
  const [logDate, setLogDate] = useState(initialDate || getTodayDateString());
  const existingLog = state.dailyLogs[logDate];
  const routineRecord = state.dailyRoutines[logDate];

  // Default values
  const [physicsHours, setPhysicsHours] = useState(2);
  const [chemistryHours, setChemistryHours] = useState(2);
  const [mathsHours, setMathsHours] = useState(2.5);
  const [revisionHours, setRevisionHours] = useState(1);
  const [otherHours, setOtherHours] = useState(0);
  const [questionsTarget, setQuestionsTarget] = useState(state.settings.dailyQuestionTarget || 60);
  const [questionsSolved, setQuestionsSolved] = useState(45);
  const [focusRating, setFocusRating] = useState(4);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when date changes or existing log loads
  useEffect(() => {
    if (existingLog) {
      setPhysicsHours(existingLog.physicsHours);
      setChemistryHours(existingLog.chemistryHours);
      setMathsHours(existingLog.mathsHours);
      setRevisionHours(existingLog.revisionHours);
      setOtherHours(existingLog.otherHours || 0);
      setQuestionsTarget(existingLog.questionsTarget);
      setQuestionsSolved(existingLog.questionsSolved);
      setFocusRating(existingLog.focusRating);
      setNotes(existingLog.notes || '');
    } else {
      // Auto pre-populate from routine completions if available
      const tally = tallyRoutineStudyHours(routineRecord);
      if (tally.total > 0) {
        setPhysicsHours(tally.physics);
        setChemistryHours(tally.chemistry);
        setMathsHours(tally.maths);
        setRevisionHours(tally.revision);
        setOtherHours(tally.other);
      } else {
        setPhysicsHours(2);
        setChemistryHours(2);
        setMathsHours(2);
        setRevisionHours(1);
        setOtherHours(0);
      }
      setQuestionsTarget(state.settings.dailyQuestionTarget || 60);
      setQuestionsSolved(0);
      setFocusRating(4);
      setNotes('');
    }
    setSavedSuccess(false);
  }, [logDate, existingLog, routineRecord, state.settings.dailyQuestionTarget]);

  const handleRefreshFromRoutine = () => {
    const tally = tallyRoutineStudyHours(routineRecord);
    setPhysicsHours(tally.physics);
    setChemistryHours(tally.chemistry);
    setMathsHours(tally.maths);
    setRevisionHours(tally.revision);
    setOtherHours(tally.other);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: DailyLogRecord = {
      date: logDate,
      physicsHours: Number(physicsHours) || 0,
      chemistryHours: Number(chemistryHours) || 0,
      mathsHours: Number(mathsHours) || 0,
      revisionHours: Number(revisionHours) || 0,
      otherHours: Number(otherHours) || 0,
      questionsTarget: Number(questionsTarget) || 0,
      questionsSolved: Number(questionsSolved) || 0,
      focusRating,
      notes: notes.trim(),
      completedAt: new Date().toISOString(),
    };

    onUpdateState((prev) => {
      // Calculate true consecutive streak
      const updatedStreak = calculateUpdatedStreak(
        prev.settings.streakDays,
        prev.settings.lastActiveDate,
        logDate
      );

      return {
        ...prev,
        dailyLogs: {
          ...prev.dailyLogs,
          [logDate]: newRecord,
        },
        settings: {
          ...prev.settings,
          streakDays: updatedStreak,
          lastActiveDate: logDate,
        },
      };
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const totalLoggedHours = Number(
    (physicsHours + chemistryHours + mathsHours + revisionHours + otherHours).toFixed(1)
  );

  const changeDateBy = (days: number) => {
    setLogDate((prev) => shiftDateString(prev, days));
  };

  // Past logs list sorted by date descending
  const pastLogs = Object.values(state.dailyLogs).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Date Navigation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Daily Study Performance Logger</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Record your subject study hours, questions solved, and evening reflections.
              </p>
            </div>
          </div>

          {/* Date Picker Controls */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <button
              onClick={() => changeDateBy(-1)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Previous Day"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
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
      </div>

      {/* Main Journal Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Subject Study Hours */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Subject Study Hours
                </h3>
                <p className="text-[11px] text-slate-400">Total Logged: <span className="text-indigo-400 font-bold">{totalLoggedHours} hrs</span></p>
              </div>

              <button
                type="button"
                onClick={handleRefreshFromRoutine}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Tally completed slots from today's routine"
              >
                <RefreshCw className="w-3 h-3 text-indigo-400" /> Pull Routine Hours
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-emerald-400 mb-1">
                  <span>Physics Hours</span>
                  <span>{physicsHours}h</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="16"
                  value={physicsHours}
                  onChange={(e) => setPhysicsHours(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800/80 border border-emerald-500/30 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-amber-400 mb-1">
                  <span>Chemistry Hours</span>
                  <span>{chemistryHours}h</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="16"
                  value={chemistryHours}
                  onChange={(e) => setChemistryHours(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800/80 border border-amber-500/30 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-blue-400 mb-1">
                  <span>Mathematics Hours</span>
                  <span>{mathsHours}h</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="16"
                  value={mathsHours}
                  onChange={(e) => setMathsHours(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800/80 border border-blue-500/30 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-indigo-400 mb-1">
                    Revision Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={revisionHours}
                    onChange={(e) => setRevisionHours(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800/80 border border-indigo-500/30 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-400 mb-1">
                    Coaching / Other
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={otherHours}
                    onChange={(e) => setOtherHours(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800/80 border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Question Solved Counter & Focus Rating */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Target className="w-4 h-4 text-pink-400" /> Problem Solving & Focus
                </h3>
                <span className="text-xs font-semibold text-slate-300">
                  {questionsSolved} / {questionsTarget} Qs
                </span>
              </div>

              {/* Question Practice Counter */}
              <div className="space-y-3 mb-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Questions Target
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={questionsTarget}
                      onChange={(e) => setQuestionsTarget(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-pink-400 mb-1">
                      Questions Solved
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={questionsSolved}
                      onChange={(e) => setQuestionsSolved(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-800/80 border border-pink-500/30 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500 font-bold"
                    />
                  </div>
                </div>

                {/* Quick Add Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-500">Quick add solved:</span>
                  {[5, 10, 15, 25].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setQuestionsSolved((prev) => prev + amt)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5-Star Focus Rating */}
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Today's Concentration & Focus Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFocusRating(star)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                      title={`${star} Star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= focusRating
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-amber-400 font-semibold ml-2">
                    {focusRating === 5 && '🔥 High Flow State!'}
                    {focusRating === 4 && '⚡ Good Focus'}
                    {focusRating === 3 && '👍 Average Day'}
                    {focusRating <= 2 && '⚠️ Distracted - Recover Tomorrow'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Daily Reflection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
          <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Evening Reflection & JEE Diary
          </label>
          <textarea
            rows={3}
            placeholder="What went well today? Which formulas or topics were mastered? Where did time slip away? Write your key takeaways for tomorrow..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500 resize-none"
          />

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
            <div>
              {savedSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-4 h-4" /> Daily log saved successfully!
                </span>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Save className="w-4 h-4" /> Save Daily Log
            </button>
          </div>
        </div>
      </form>

      {/* History of Past Submitted Logs */}
      {pastLogs.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Recent Daily Logs ({pastLogs.length} saved)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pastLogs.slice(0, 6).map((log) => {
              const day = getDayOfWeekFromDate(log.date);
              const total = (log.physicsHours + log.chemistryHours + log.mathsHours + log.revisionHours + (log.otherHours || 0)).toFixed(1);
              return (
                <div
                  key={log.date}
                  onClick={() => setLogDate(log.date)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    log.date === logDate
                      ? 'bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-200">{day}, {log.date}</span>
                    <span className="flex items-center text-amber-400">
                      {'★'.repeat(log.focusRating)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Study Time: <span className="font-semibold text-slate-200">{total} hrs</span></div>
                    <div>Questions: <span className="font-semibold text-pink-400">{log.questionsSolved}</span> / {log.questionsTarget}</div>
                    {log.notes && (
                      <p className="text-[11px] text-slate-500 truncate mt-1">"{log.notes}"</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
