import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import { loadAppState, saveAppState } from './utils/storage';
import Header, { ActiveTab } from './components/Header';
import TodayRoutine from './components/TodayRoutine';
import TimetablePlanner from './components/TimetablePlanner';
import DailyLogger from './components/DailyLogger';
import BacklogManager from './components/BacklogManager';
import AnalyticsView from './components/AnalyticsView';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('routine');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auto-save on any state change
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const updateState = (updater: (prev: AppState) => AppState) => {
    setState((prev) => updater(prev));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top App Header with Navigation & Live Clock */}
      <Header
        state={state}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'routine' && (
          <TodayRoutine state={state} onUpdateState={updateState} />
        )}

        {activeTab === 'planner' && (
          <TimetablePlanner state={state} onUpdateState={updateState} />
        )}

        {activeTab === 'logger' && (
          <DailyLogger state={state} onUpdateState={updateState} />
        )}

        {activeTab === 'backlog' && (
          <BacklogManager state={state} onUpdateState={updateState} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView state={state} />
        )}
      </main>

      {/* Footer Motivation Banner */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          "Consistency beats talent when talent doesn't work hard." — Class 11 JEE Aspirant Routine & Timetable Tracker
        </p>
      </footer>

      {/* Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        state={state}
        onUpdateState={updateState}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
