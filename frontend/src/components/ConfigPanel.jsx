import React, { useState } from 'react';
import { Clock, Download, KeyRound, Eye, EyeOff } from 'lucide-react';

const ConfigPanel = ({
  expirationHours,
  setExpirationHours,
  maxDownloads,
  setMaxDownloads,
  passcode,
  setPasscode,
}) => {
  const [showPasscode, setShowPasscode] = useState(false);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-cyan-400" />
          Security & Destruction Rules
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">Customizable</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Expiration Time Option */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Expiration Time
          </label>
          <select
            value={expirationHours}
            onChange={(e) => setExpirationHours(Number(e.target.value))}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
          >
            <option value={1}>1 Hour (Quick Shred)</option>
            <option value={24}>24 Hours (Standard)</option>
            <option value={168}>7 Days (Extended)</option>
          </select>
        </div>

        {/* Max Downloads Option */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Max Downloads
          </label>
          <select
            value={maxDownloads}
            onChange={(e) => setMaxDownloads(Number(e.target.value))}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
          >
            <option value={1}>1 Download (Burn on Read)</option>
            <option value={5}>5 Downloads</option>
            <option value={10}>10 Downloads</option>
          </select>
        </div>

        {/* Optional Passcode Option */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-pink-400" />
            Passcode Protection <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type={showPasscode ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="e.g. 4829 or SecretPIN"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-3.5 pr-10 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConfigPanel;
