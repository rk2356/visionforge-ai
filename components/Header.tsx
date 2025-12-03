import React from 'react';
import { Layers, Zap, Cpu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-obsidian-950/80 border-b border-obsidian-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-electric-blue blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
            <div className="relative bg-obsidian-800 p-2.5 rounded-xl border border-obsidian-700 group-hover:border-electric-blue/50 transition-colors">
              <Layers size={24} className="text-electric-blue" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
              VisionForge <span className="text-electric-blue">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-[0.2em] group-hover:text-electric-cyan transition-colors">
              Transform your ideas into real
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-xs font-semibold text-slate-300">
            <Cpu size={14} className="text-cinema-gold" />
            <span>Gemini 3.0 Pro</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-electric-blue/10 border border-electric-blue/20 text-xs font-semibold text-electric-blue">
            <Zap size={14} />
            <span>12K Cinematic Engine</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;