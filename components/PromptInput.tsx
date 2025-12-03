import React from 'react';
import { AlertCircle, X, TerminalSquare } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  value, 
  onChange, 
  onClear, 
  onSubmit, 
  isProcessing 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-obsidian-800 rounded-xl border border-obsidian-700 overflow-hidden shadow-2xl transition-all duration-300 focus-within:border-electric-blue/60 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)] group">
      
      {/* Header Bar */}
      <div className="px-5 py-3 border-b border-obsidian-700 flex justify-between items-center bg-obsidian-900/50">
        <h2 className="font-display font-semibold text-slate-300 flex items-center gap-2 text-xs tracking-widest uppercase">
          <TerminalSquare size={14} className="text-electric-blue" />
          Input Console
        </h2>
        {value && (
          <button 
            onClick={onClear}
            disabled={isProcessing}
            className="text-slate-500 hover:text-white transition-colors text-xs font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5"
          >
            <X size={14} /> CLEAR
          </button>
        )}
      </div>

      {/* Text Area */}
      <div className="flex-grow relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="// Enter your concept, story, or rough idea here...
// Example: 'A hindi story about a futuristic warrior in Mumbai'
// System will auto-breakdown into cinematic shots."
          className="w-full h-full p-6 resize-none outline-none text-slate-100 placeholder:text-slate-600 text-base md:text-lg leading-relaxed bg-transparent font-sans"
          disabled={isProcessing}
          spellCheck={false}
        />
        <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-obsidian-900 border border-obsidian-700 text-[10px] text-slate-500 font-mono">
          {value.length} CHARS
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-obsidian-900/80 border-t border-obsidian-700">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <AlertCircle className="text-electric-blue shrink-0" size={14} />
          <p className="truncate">
            Auto-injects <span className="text-slate-300">12K Assets</span> for recognized characters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;