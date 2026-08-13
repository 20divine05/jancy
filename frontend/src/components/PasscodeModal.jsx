import React, { useState } from 'react';
import { Lock, KeyRound, AlertTriangle, Eye, EyeOff, Shield } from 'lucide-react';

const PasscodeModal = ({ onSubmit, error, loading }) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim()) {
      onSubmit(passcode.trim());
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl max-w-md w-full mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white">Passcode Protected Vault</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          The owner has secured this disposable file with a passcode PIN. Enter it below to unlock download access.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2 font-mono">
            ENTER PASSCODE / PIN
          </label>
          <div className="relative">
            <input
              type={showPasscode ? 'text' : 'password'}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter file PIN..."
              required
              autoFocus
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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

        <button
          type="submit"
          disabled={loading || !passcode.trim()}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying PIN...
            </span>
          ) : (
            <>
              <KeyRound className="w-4 h-4" /> Unlock & Access File
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PasscodeModal;
