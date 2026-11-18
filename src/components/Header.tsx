import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Flame, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  Sparkles
} from 'lucide-react';
import { AppState } from '../types';

export type ActiveTab = 'routine' | 'planner' | 'logger' | 'backlog' | 'analytics';

interface HeaderProps {
  state: AppState;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
}

export default function Header({
  state,
  activeTab,
  onTabChange,
  onOpenSettings,
}: HeaderProps) {
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingBacklogsCount = (state.backlogs || []).filter((b) => !b.resolved).length;

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'routine', label: "Today's Routine", icon: Calendar },
    { id: 'planner', label: 'Timetable Planner', icon: Clock },
    { id: 'logger', label: 'Daily Logger', icon: BookOpen },
    { id: 'backlog', label: 'Backlog Box', icon: AlertTriangle, badge: pendingBacklogsCount },
    { id: 'analytics', label: 'Progress & Analytics', icon: BarChart3 },
  ];

  return (
    <header className="bg-slate-900/95 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Student Info */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-lg">
                JEE
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-100">
                    {state.settings.studentName}
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-indigo-300 border border-indigo-500/30">
                    JEE {state.settings.targetYear} Aspirant
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  <span className="font-mono text-slate-300">{currentTimeStr || '00:00:00 AM'}</span>
                  <span>•</span>
                  <span>Class 11 Hub</span>
                </div>
              </div>
            </div>

            {/* Streak & Settings for mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{state.settings.streakDays}d</span>
              </div>
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                title="Settings"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Streak & Settings */}
          <div className="hidden md:flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-sm"
              title="Daily consistency streak"
            >
              <Flame className="w-4 h-4 animate-pulse text-amber-400" />
              <span>{state.settings.streakDays} Days Streak</span>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Settings & Backup"
              aria-label="Settings & Backup"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
