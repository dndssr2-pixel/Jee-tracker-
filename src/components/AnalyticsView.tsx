import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  Flame, 
  Target, 
  TrendingUp, 
  Award, 
  BookOpen,
  Calendar,
  Zap
} from 'lucide-react';
import { AppState, DayOfWeek } from '../types';
import { getTodayDateString, getDayOfWeekFromDate } from '../utils/time';
import { tallyRoutineStudyHours } from '../utils/loggerCalculations';

interface AnalyticsViewProps {
  state: AppState;
}

export default function AnalyticsView({ state }: AnalyticsViewProps) {
  const targetDailyHours = state.settings.dailyStudyTargetHours || 8;
  const targetDailyQuestions = state.settings.dailyQuestionTarget || 60;

  // Calculate past 7 days dates
  const past7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const yr = d.getFullYear();
    const mo = (d.getMonth() + 1).toString().padStart(2, '0');
    const da = d.getDate().toString().padStart(2, '0');
    past7Days.push(`${yr}-${mo}-${da}`);
  }

  // Get data for each day (from dailyLogs or fallback to routine tallies)
  let totalWeekHours = 0;
  let totalWeekQuestions = 0;
  let totalPhysicsHours = 0;
  let totalChemistryHours = 0;
  let totalMathsHours = 0;
  let totalRevisionHours = 0;
  let daysWithActivity = 0;

  const weeklyBarData = past7Days.map((dateStr) => {
    const log = state.dailyLogs[dateStr];
    const routine = state.dailyRoutines[dateStr];

    let p = 0, c = 0, m = 0, r = 0, other = 0, q = 0;

    if (log) {
      p = log.physicsHours || 0;
      c = log.chemistryHours || 0;
      m = log.mathsHours || 0;
      r = log.revisionHours || 0;
      other = log.otherHours || 0;
      q = log.questionsSolved || 0;
    } else if (routine) {
      const tally = tallyRoutineStudyHours(routine);
      p = tally.physics;
      c = tally.chemistry;
      m = tally.maths;
      r = tally.revision;
      other = tally.other;
    }

    const dayTotalHours = Number((p + c + m + r + other).toFixed(1));
    if (dayTotalHours > 0 || q > 0) {
      daysWithActivity++;
    }

    totalWeekHours += dayTotalHours;
    totalWeekQuestions += q;
    totalPhysicsHours += p;
    totalChemistryHours += c;
    totalMathsHours += m;
    totalRevisionHours += r;

    const dayName = getDayOfWeekFromDate(dateStr).slice(0, 3);

    return {
      date: dateStr,
      dayName,
      hours: dayTotalHours,
      questions: q,
      target: targetDailyHours,
    };
  });

  const pcmTotal = totalPhysicsHours + totalChemistryHours + totalMathsHours;
  const pcmPercent = (hours: number) => (pcmTotal > 0 ? Math.round((hours / pcmTotal) * 100) : 0);

  const physicsPct = pcmPercent(totalPhysicsHours);
  const chemistryPct = pcmPercent(totalChemistryHours);
  const mathsPct = pcmPercent(totalMathsHours);

  const maxBarHour = Math.max(targetDailyHours, ...weeklyBarData.map((d) => d.hours), 10);
  const avgHoursPerActiveDay = daysWithActivity > 0 ? (totalWeekHours / daysWithActivity).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: 7-Day Total Hours */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>7-Day Study Hours</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {totalWeekHours.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Avg {avgHoursPerActiveDay} hrs / active day</p>
        </div>

        {/* Card 2: Questions Solved */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Questions Solved</span>
            <Target className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold text-pink-400">
            {totalWeekQuestions} <span className="text-xs font-normal text-slate-400">problems</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Goal: {targetDailyQuestions * 7} / week</p>
        </div>

        {/* Card 3: Consistency Streak */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 flex items-center gap-1">
            <span>{state.settings.streakDays}</span>
            <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Keep the momentum unbroken!</p>
        </div>

        {/* Card 4: Target Year Countdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>JEE Target</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            JEE {state.settings.targetYear}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Class 11 Foundation Phase</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study Hours Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" /> Weekly Study Hours (Target vs. Actual)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target: {targetDailyHours} hrs/day • Dashed line indicates daily target
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500"></span> Actual Hours
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-0.5 bg-slate-500"></span> Target
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 relative">
            {/* Target line */}
            <div
              className="absolute left-0 right-0 border-b-2 border-dashed border-indigo-500/30 z-0 pointer-events-none"
              style={{
                bottom: `${(targetDailyHours / maxBarHour) * 100}%`,
              }}
            >
              <span className="absolute -top-3.5 right-1 text-[10px] text-indigo-400 font-semibold bg-slate-900 px-1 rounded">
                Target {targetDailyHours}h
              </span>
            </div>

            {weeklyBarData.map((d) => {
              const heightPct = Math.min(Math.round((d.hours / maxBarHour) * 100), 100);
              const isMet = d.hours >= targetDailyHours;
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center h-full justify-end z-10 group">
                  <div className="text-[10px] text-slate-400 mb-1 group-hover:text-white transition-colors">
                    {d.hours > 0 ? `${d.hours}h` : '-'}
                  </div>
                  <div className="w-full max-w-[36px] bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isMet
                          ? 'bg-gradient-to-t from-indigo-600 to-emerald-400 group-hover:to-emerald-300'
                          : 'bg-gradient-to-t from-slate-700 to-indigo-500 group-hover:to-indigo-400'
                      }`}
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 mt-2 group-hover:text-slate-200">
                    {d.dayName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PCM Subject Balance Donut / Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" /> PCM Subject Balance
              </h3>
              <span className="text-xs text-slate-400">{pcmTotal.toFixed(1)} hrs total</span>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Maintaining an equal 1:1:1 balance between Physics, Chemistry, and Mathematics is critical for JEE top percentiles.
            </p>

            {/* Subject Meters */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-emerald-400 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Physics
                  </span>
                  <span>{totalPhysicsHours}h ({physicsPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${physicsPct}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-amber-400 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Chemistry
                  </span>
                  <span>{totalChemistryHours}h ({chemistryPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${chemistryPct}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-blue-400 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Mathematics
                  </span>
                  <span>{totalMathsHours}h ({mathsPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${mathsPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {pcmTotal === 0
                ? 'Log your study sessions in Daily Logger or complete routine slots to see your live balance!'
                : physicsPct >= 45 || chemistryPct >= 45 || mathsPct >= 45
                ? 'Notice: One subject is dominating your study time. Try giving equal focus to all three subjects this week.'
                : 'Balanced preparation! Your Physics, Chemistry, and Math distribution is well proportioned.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
