import React, { useState, useRef } from 'react';
import { 
  X, 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  User, 
  Calendar, 
  Target, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { AppState } from '../types';
import { downloadBackupFile, importDataFromJSON } from '../utils/storage';
import { getStarterAppState } from '../utils/starterData';
import ConfirmModal from './ConfirmModal';

interface SettingsModalProps {
  isOpen: boolean;
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onClose: () => void;
}

export default function SettingsModal({
  isOpen,
  state,
  onUpdateState,
  onClose,
}: SettingsModalProps) {
  const [studentName, setStudentName] = useState(state.settings.studentName);
  const [targetYear, setTargetYear] = useState(state.settings.targetYear);
  const [dailyTargetHours, setDailyTargetHours] = useState(state.settings.dailyStudyTargetHours || 8);
  const [dailyQuestionTarget, setDailyQuestionTarget] = useState(state.settings.dailyQuestionTarget || 60);
  const [importError, setImportError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        studentName: studentName.trim() || 'JEE Aspirant',
        targetYear,
        dailyStudyTargetHours: Number(dailyTargetHours) || 8,
        dailyQuestionTarget: Number(dailyQuestionTarget) || 60,
      },
    }));
    onClose();
  };

  const handleExport = () => {
    downloadBackupFile(state);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const imported = importDataFromJSON(content);
        onUpdateState(() => imported);
        setImportError('');
        onClose();
      } catch (err: any) {
        setImportError(err.message || 'Failed to import backup file. File format invalid.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetAll = () => {
    const starter = getStarterAppState();
    onUpdateState(() => starter);
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold">Settings & Backup</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Configure your student profile and manage offline data backups.
        </p>

        {importError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Aspirant Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Target JEE Year
              </label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="2026">JEE 2026</option>
                <option value="2027">JEE 2027 (Class 11 Aspirants)</option>
                <option value="2028">JEE 2028</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" /> Daily Target Hours
              </label>
              <input
                type="number"
                min="1"
                max="16"
                value={dailyTargetHours}
                onChange={(e) => setDailyTargetHours(parseInt(e.target.value, 10) || 8)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-pink-400" /> Daily Target Questions
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={dailyQuestionTarget}
                onChange={(e) => setDailyQuestionTarget(parseInt(e.target.value, 10) || 60)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>

        {/* Data Backup & Restore Section */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Backup & Data Portability
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export JSON Backup
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Upload className="w-4 h-4 text-indigo-400" /> Import JSON Backup
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset All Data to Fresh State
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Entire Application"
        message="This will wipe all timetables, daily routines, logs, and backlogs, resetting the app to default. Export a backup first if you want to keep your data!"
        confirmLabel="Reset Everything"
        isDestructive={true}
        onConfirm={handleResetAll}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
