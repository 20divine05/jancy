import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Flame, Lock, ArrowRight, RotateCcw } from 'lucide-react';

const SuccessCard = ({ uploadedFile, onReset }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedFile.downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            File Secured & Vaulted!
          </h3>
          <p className="text-xs text-slate-400">
            Share this link. The file will self-destruct once downloaded or expired.
          </p>
        </div>
      </div>

      {/* Share Link Input with Copy Button */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-300 font-mono">
          YOUR SECURE DISPOSABLE LINK
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={uploadedFile.downloadUrl}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-cyan-300 font-mono selection:bg-cyan-500 selection:text-slate-950 focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className={`px-5 py-3 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all duration-200 shrink-0 shadow-lg ${
              copied
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 scale-105'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* File Parameter Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-mono">File Name</span>
          <span className="font-semibold text-slate-200 truncate block mt-0.5">{uploadedFile.filename}</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-mono">File Size</span>
          <span className="font-semibold text-slate-200 block mt-0.5">{formatBytes(uploadedFile.fileSize)}</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-mono">Max Downloads</span>
          <span className="font-semibold text-amber-400 block mt-0.5">{uploadedFile.maxDownloads} Allowed</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-mono">Protection</span>
          <span className="font-semibold block mt-0.5">
            {uploadedFile.requiresPasscode ? (
              <span className="text-pink-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Protected
              </span>
            ) : (
              <span className="text-emerald-400">Open Link</span>
            )}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <a
          href={uploadedFile.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          Test Download Page <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-indigo-500/20"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Upload Another File
        </button>
      </div>

    </div>
  );
};

export default SuccessCard;
