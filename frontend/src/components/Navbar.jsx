import React from 'react';
import { Shield, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0f19]/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-6 h-6 stroke-[2.2]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              Drop<span className="text-gradient">Shield</span>
            </span>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Self-Destruct File Vault</p>
          </div>
        </Link>

        {/* Feature Badges */}
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>End-to-End Ephemeral</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Zero Footprint</span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
