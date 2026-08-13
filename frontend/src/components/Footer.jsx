import React from 'react';
import { ShieldCheck, Flame, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#0b0f19] py-8 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>DropShield Disposable File Protocol</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" /> Auto-Purge Storage
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-indigo-400" /> Encrypted TTL Indexes
          </span>
        </div>

        <p>© {new Date().getFullYear()} DropShield. All files self-destruct upon expiration.</p>

      </div>
    </footer>
  );
};

export default Footer;
