import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataStore } from '../../services/dataStore';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Download,
  Upload,
  Sliders,
  Database,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllDemoData, resetAllocations, showToast } = useApp();

  const [threshold, setThreshold] = useState(settings.min_score_threshold);
  const [prioritizeWeak, setPrioritizeWeak] = useState(settings.prioritize_by_weak_subjects_count);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveParameters = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      min_score_threshold: threshold,
      prioritize_by_weak_subjects_count: prioritizeWeak,
    });
  };

  const handleExportJSON = () => {
    const jsonStr = dataStore.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentora_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Export Completed', 'System database downloaded as JSON snapshot.', 'success');
  };

  const handleImportJSON = () => {
    if (!importText.trim()) return;
    const res = dataStore.importData(importText);
    setImportStatus(res);
    if (res.success) {
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-[#202C45]">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5EDFC] text-[#5478D4] text-[11px] font-bold tracking-wide uppercase font-mono mb-2">
          <SettingsIcon className="w-3 h-3" />
          <span>System Configuration</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#202C45] tracking-tight">
          Settings & Data Management
        </h2>
        <p className="text-xs sm:text-sm text-[#202C45]/70 mt-1">
          Configure algorithm scoring cutoffs, backup/restore application data, or reset seed states.
        </p>
      </div>

      {/* Algorithm Matching Parameters */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-5 lg:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#EAE2D8]">
          <div className="w-9 h-9 rounded-xl bg-[#F9E3D9] text-[#F07857] flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-[#202C45]">Matching Heuristic Parameters</h3>
            <p className="text-xs text-[#202C45]/70">Tune the minimum score cutoff and student ordering heuristics</p>
          </div>
        </div>

        <form onSubmit={handleSaveParameters} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#202C45] mb-1 font-mono text-[11px]">
              MINIMUM ELIGIBILITY CUTOFF: <strong className="text-[#F07857]">{threshold} PTS</strong> (Default: 50)
            </label>
            <input
              type="range"
              min="30"
              max="80"
              step="5"
              value={threshold}
              onChange={e => setThreshold(parseInt(e.target.value))}
              className="w-full max-w-md accent-[#F07857] cursor-pointer"
            />
            <p className="text-[11px] text-[#202C45]/60 mt-1">
              Mentors whose calculated match score is below this threshold will be marked ineligible for that student.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="prioritizeWeak"
              checked={prioritizeWeak}
              onChange={e => setPrioritizeWeak(e.target.checked)}
              className="rounded accent-[#F07857] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="prioritizeWeak" className="font-semibold text-[#202C45] cursor-pointer">
              Prioritize students with highest count of challenge subjects first
            </label>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#F07857] hover:bg-[#e06847] text-white font-bold text-xs shadow-xs cursor-pointer transition"
          >
            Save Parameter Changes
          </button>
        </form>
      </div>

      {/* Database Backup & Restore */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-5 lg:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#EAE2D8]">
          <div className="w-9 h-9 rounded-xl bg-[#E5EDFC] text-[#5478D4] flex items-center justify-center font-bold">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-[#202C45]">Database Snapshot & Backup</h3>
            <p className="text-xs text-[#202C45]/70">Export client database to JSON or import an existing data snapshot</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Export card */}
          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-3">
            <div>
              <span className="font-bold text-[#202C45] block font-heading">Export Current State</span>
              <p className="text-[11px] text-[#202C45]/70 mt-0.5">
                Save all students, mentors, requests, allocations, and settings as a JSON file.
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 rounded-xl bg-white border border-[#EAE2D8] hover:bg-white/80 text-[#202C45] font-bold text-xs transition flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#F07857]" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import card */}
          <div className="p-4 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] space-y-3">
            <div>
              <span className="font-bold text-[#202C45] block font-heading">Import JSON Snapshot</span>
              <p className="text-[11px] text-[#202C45]/70 mt-0.5">Paste a previously exported JSON backup payload below.</p>
            </div>
            <textarea
              rows={2}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Paste JSON string here..."
              className="w-full p-2.5 bg-white border border-[#EAE2D8] rounded-xl font-mono text-[11px] text-[#202C45] focus:outline-none focus:border-[#5478D4]"
            />
            {importStatus && (
              <div
                className={`text-[11px] font-mono font-bold ${
                  importStatus.success ? 'text-[#63AFA3]' : 'text-[#F07857]'
                }`}
              >
                {importStatus.message}
              </div>
            )}
            <button
              onClick={handleImportJSON}
              disabled={!importText.trim()}
              className="px-4 py-2 rounded-xl bg-[#5478D4] hover:bg-[#4367be] text-white font-bold text-xs disabled:opacity-40 shadow-xs cursor-pointer transition"
            >
              Restore Snapshot
            </button>
          </div>
        </div>
      </div>

      {/* Reset Operations */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-5 lg:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#EAE2D8]">
          <div className="w-9 h-9 rounded-xl bg-[#F9E3D9] text-[#F07857] flex items-center justify-center font-bold">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-[#202C45]">Reset & System Refresh</h3>
            <p className="text-xs text-[#202C45]/70">Reset active matchings or restore default seed data</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => {
              resetAllocations();
              showToast('Allocations Cleared', 'All students set to Unallocated; mentor loads reset to 0.', 'info');
            }}
            className="px-4 py-2.5 rounded-xl border border-[#EAE2D8] bg-[#FFF9F0] hover:bg-[#EAE2D8]/40 text-[#202C45] font-bold transition cursor-pointer"
          >
            Clear Current Allocations Only
          </button>

          <button
            onClick={() => {
              if (window.confirm('Restore all original sample students and faculty mentors? Custom additions will be reset.')) {
                resetAllDemoData();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[#F07857] hover:bg-[#e06847] text-white font-bold transition shadow-xs cursor-pointer"
          >
            Reset to Original Sample Dataset
          </button>
        </div>
      </div>
    </div>
  );
};
