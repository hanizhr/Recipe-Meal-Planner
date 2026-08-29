import React, { useState } from 'react';
import { 
  X, 
  User, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Dumbbell,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { StorageService } from '../db/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onRefreshData: () => void;
  onOpenOnboarding: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onRefreshData,
  onOpenOnboarding,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name);
  const [calorieTarget, setCalorieTarget] = useState(profile.dailyCalorieTarget);
  const [proteinTarget, setProteinTarget] = useState(profile.dailyProteinTarget);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'Daniel',
      dailyCalorieTarget: Number(calorieTarget) || 2200,
      dailyProteinTarget: Number(proteinTarget) || 140,
    };
    onUpdateProfile(updated);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportFullDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `culinaryhub-database-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importFullDatabase(content);
      if (success) {
        setImportStatus('Database successfully restored! ✓');
        onRefreshData();
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Failed to parse database file. Check format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all recipes, weekly meal plan, and shopping items to initial demo state?')) {
      StorageService.resetToDefault();
      onRefreshData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#121319] border border-[#252834] rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#252834]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF5E3A]/20 text-[#FF5E3A] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Profile & Database</h2>
              <span className="text-[11px] text-gray-400">Manage targets and local backup</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-300 mb-1 block">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1A1C24] text-sm text-white px-4 py-2.5 rounded-xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#FF5E3A]" /> Daily Calorie Goal
              </label>
              <input
                type="number"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(parseInt(e.target.value) || 2000)}
                className="w-full bg-[#1A1C24] text-sm text-white px-3 py-2 rounded-xl border border-[#252834]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-blue-400" /> Daily Protein Goal (g)
              </label>
              <input
                type="number"
                value={proteinTarget}
                onChange={(e) => setProteinTarget(parseInt(e.target.value) || 120)}
                className="w-full bg-[#1A1C24] text-sm text-white px-3 py-2 rounded-xl border border-[#252834]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white text-xs font-bold shadow-md shadow-[#FF5E3A]/20 transition-all"
          >
            {savedFeedback ? 'Changes Saved! ✓' : 'Save Profile Goals'}
          </button>
        </form>

        {/* Database Management & Free Storage */}
        <div className="pt-3 border-t border-[#252834] space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Free Local Database Backup
            </h3>
          </div>

          {importStatus && (
            <div className="p-2.5 rounded-xl bg-[#1A1C24] border border-[#252834] text-xs font-bold text-[#FF5E3A] text-center">
              {importStatus}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#1A1C24] hover:bg-[#252834] border border-[#252834] text-xs font-semibold text-gray-200"
            >
              <Download className="w-3.5 h-3.5 text-[#FF5E3A]" />
              <span>Export JSON</span>
            </button>

            <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#1A1C24] hover:bg-[#252834] border border-[#252834] text-xs font-semibold text-gray-200 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                onOpenOnboarding();
                onClose();
              }}
              className="text-xs text-[#FF5E3A] hover:underline font-semibold"
            >
              View Onboarding Splash
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
