import React from 'react';
import { Flame, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpiredNotice = () => {
  return (
    <div className="glass-card rounded-3xl p-8 sm:p-12 border border-rose-500/20 shadow-2xl max-w-md w-full mx-auto text-center space-y-6 animate-fade-in">
      
      {/* Icon Graphic */}
      <div className="relative mx-auto w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-2xl shadow-rose-500/20">
        <Flame className="w-10 h-10 animate-bounce" />
        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 border border-slate-800 text-rose-500">
          <ShieldAlert className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          File Self-Destructed
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
          This link has expired or reached its maximum download limit. Physical file contents have been purged permanently from the server vault.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-left text-xs space-y-2 text-slate-300 font-mono">
        <div className="flex items-center gap-2 text-rose-400 font-semibold">
          <span>Destroyed Reasons:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
          <li>Maximum allowed download count reached</li>
          <li>Set expiration timer (TTL index) elapsed</li>
          <li>Physical disk block unlinked & erased</li>
        </ul>
      </div>

      <Link
        to="/"
        className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to DropShield Home
      </Link>

    </div>
  );
};

export default ExpiredNotice;
