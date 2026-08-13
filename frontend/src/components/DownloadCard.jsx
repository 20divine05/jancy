import React, { useState, useEffect } from 'react';
import { Download, File, Clock, Flame, ShieldCheck, AlertCircle, HardDrive } from 'lucide-react';

const DownloadCard = ({ file, onDownload, downloading, downloadError }) => {
  const [timeLeft, setTimeLeft] = useState('');

  // Calculate live countdown timer
  useEffect(() => {
    if (!file?.expiresAt) return;

    const calculateTimeLeft = () => {
      const diff = new Date(file.expiresAt).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h remaining`);
      } else {
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [file?.expiresAt]);

  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl max-w-lg w-full mx-auto space-y-6 animate-fade-in">
      
      {/* Top Shield Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Active Vault File</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          <Flame className="w-3.5 h-3.5" />
          <span>{file.remainingDownloads} download(s) left</span>
        </div>
      </div>

      {/* File Info Main Section */}
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shrink-0 shadow-lg shadow-indigo-500/20">
          <File className="w-8 h-8" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-white truncate" title={file.filename}>
            {file.filename}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              {formatBytes(file.fileSize)}
            </span>
          </div>
        </div>
      </div>

      {/* Countdown Timer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Time Remaining</span>
        </div>
        <span className="font-mono text-sm font-bold text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-500/30">
          {timeLeft}
        </span>
      </div>

      {downloadError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{downloadError}</span>
        </div>
      )}

      {/* Download Action CTA */}
      <button
        onClick={onDownload}
        disabled={downloading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
      >
        {downloading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Decrypting & Streaming...
          </span>
        ) : (
          <>
            <Download className="w-5 h-5 stroke-[2.2]" /> Download File Now
          </>
        )}
      </button>

      {/* Self-Destruct Warning Notice */}
      <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 font-mono">
        <Flame className="w-3.5 h-3.5 text-orange-400" />
        {file.remainingDownloads <= 1
          ? 'Final Download! File will self-destruct immediately after this transfer.'
          : `File self-destructs after ${file.remainingDownloads} more download(s).`}
      </p>

    </div>
  );
};

export default DownloadCard;
