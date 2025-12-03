
import React, { useState } from 'react';
import { Check, Copy, RefreshCcw, Wand2, ShieldCheck, Film, Clapperboard, Sparkles, AlignLeft, Video } from 'lucide-react';
import { SafetyStatus, SanitizeResult } from '../types';

interface OutputDisplayProps {
  status: SafetyStatus;
  result: SanitizeResult | null;
  onRetry: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ status, result, onRetry }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedVideoIndex, setCopiedVideoIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyVideo = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedVideoIndex(index);
    setTimeout(() => setCopiedVideoIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-obsidian-800 rounded-xl border border-obsidian-700 overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="px-5 py-3 border-b border-obsidian-700 flex justify-between items-center bg-obsidian-900/50">
        <h2 className="font-display font-semibold text-slate-300 flex items-center gap-2 text-xs tracking-widest uppercase">
          <Film size={14} className="text-cinema-gold" />
          Production Output
        </h2>
        {result?.safePrompt && result.safePrompt.length > 0 && (
           <span className="text-[10px] font-bold text-obsidian-950 bg-electric-cyan px-2 py-0.5 rounded-sm">
             {result.safePrompt.length} SHOTS
           </span>
        )}
      </div>

      <div className="flex-grow p-6 relative overflow-y-auto custom-scrollbar bg-obsidian-800/50">
        
        {/* IDLE STATE */}
        {status === SafetyStatus.IDLE && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
            <div className="w-20 h-20 bg-obsidian-700/50 rounded-2xl flex items-center justify-center mb-6 border border-obsidian-600 rotate-3">
              <Clapperboard size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-300 mb-2">Ready to Direct</h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Enter your concept. The AI Director will generate a sequence of 12K photorealistic shots (2800+ chars each) and video prompts.
            </p>
          </div>
        )}

        {/* PROCESSING STATE */}
        {status === SafetyStatus.PROCESSING && (
          <div className="h-full flex flex-col items-center justify-center text-center z-10">
            <div className="relative mb-8">
               <div className="w-20 h-20 border-4 border-obsidian-700 rounded-full"></div>
               <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-electric-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
               <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-electric-cyan animate-pulse" size={24} />
            </div>
            <p className="text-electric-blue font-display font-bold text-lg animate-pulse tracking-widest uppercase">Rendering Scenes</p>
            <p className="text-slate-500 text-xs mt-3 font-mono">Detailed Analysis... <br/>Calculating Physics & Light...</p>
          </div>
        )}

        {/* RESULT STATE */}
        {status === SafetyStatus.SAFE && result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Metadata/Issues Header */}
             {result.detectedIssues && result.detectedIssues.length > 0 && (
                <div className="bg-obsidian-900 border border-obsidian-700 rounded-lg p-4 flex gap-4 items-start">
                  <div className="p-2 bg-cinema-red/10 rounded-md shrink-0">
                     <ShieldCheck size={16} className="text-cinema-red" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Content Adapted</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.detectedIssues.map((issue, i) => (
                        <span key={i} className="text-[10px] bg-cinema-red/10 text-cinema-red px-2 py-0.5 rounded border border-cinema-red/20 font-medium">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
             )}

             {/* Prompts List */}
             <div className="space-y-8">
               {result.safePrompt.map((item, index) => {
                 // item is now an object { title, prompt }
                 const charCount = item.prompt.length;
                 const videoPromptContent = result.videoPrompts?.[index];
                 
                 return (
                   <div key={index} className="group border-b border-obsidian-700/50 pb-8 last:border-0 last:pb-0">
                      {/* Shot Header - Now uses specific TITLE */}
                      <div className="flex justify-between items-center mb-2 pl-1">
                         <span className="text-xs font-display font-bold text-electric-cyan opacity-90 tracking-wide uppercase">
                           {item.title}
                         </span>
                      </div>

                      {/* Image Prompt Box */}
                      <div className="bg-obsidian-900/80 p-5 rounded-lg border border-obsidian-700 relative hover:border-electric-blue/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300 mb-4">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-electric-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Image Prompt</h4>
                            <button
                                onClick={() => handleCopy(item.prompt, index)}
                                className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold tracking-wider transition-all uppercase border ${
                                  copiedIndex === index
                                    ? "bg-electric-blue border-electric-blue text-white" 
                                    : "bg-transparent border-obsidian-600 text-slate-400 hover:text-white hover:border-electric-blue/50"
                                }`}
                              >
                                {copiedIndex === index ? <Check size={12} /> : <Copy size={12} />}
                                {copiedIndex === index ? "COPIED" : "COPY IMAGE"}
                            </button>
                          </div>
                          <p className="text-sm text-slate-300 leading-7 font-light whitespace-pre-wrap font-sans selection:bg-electric-blue/30">
                            {item.prompt}
                          </p>
                          <div className="mt-3 flex justify-end">
                            <span className={`text-[10px] font-mono flex items-center gap-1 ${charCount < 2000 ? 'text-cinema-red' : 'text-slate-600'}`}>
                              <AlignLeft size={10} /> {charCount} chars {charCount < 2000 && "(LOW DETAIL)"}
                            </span>
                          </div>
                      </div>

                      {/* Video Prompt Box */}
                      {videoPromptContent && (
                        <div className="bg-obsidian-950/50 p-4 rounded-lg border border-purple-500/20 relative hover:border-purple-500/40 transition-all duration-300">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                <Video size={14} className="text-purple-400" />
                                <h4 className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Video Action Prompt</h4>
                             </div>
                             <button
                                onClick={() => handleCopyVideo(videoPromptContent, index)}
                                className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold tracking-wider transition-all uppercase border ${
                                  copiedVideoIndex === index
                                    ? "bg-purple-600 border-purple-600 text-white" 
                                    : "bg-transparent border-purple-900/50 text-slate-400 hover:text-white hover:border-purple-500/50"
                                }`}
                              >
                                {copiedVideoIndex === index ? <Check size={12} /> : <Copy size={12} />}
                                {copiedVideoIndex === index ? "COPIED" : "COPY VIDEO"}
                             </button>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed font-light italic">
                            "{videoPromptContent}"
                          </p>
                        </div>
                      )}
                   </div>
                 );
               })}
             </div>

             {/* Enhancement Note */}
             <div className="flex items-center gap-3 py-3 border-t border-obsidian-700 text-xs text-slate-500">
                <Wand2 size={14} className="text-cinema-gold" />
                <span className="font-mono">ENHANCEMENT_LOG: {result.enhancements}</span>
             </div>
          </div>
        )}

        {/* ERROR STATE */}
        {status === SafetyStatus.ERROR && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-cinema-red border border-red-500/20">
              <RefreshCcw size={24} />
            </div>
            <h3 className="text-white font-display font-semibold text-lg">Generation Failed</h3>
            <p className="text-slate-500 text-sm mt-2 mb-6">Network or server interruption.</p>
            <button 
              onClick={onRetry}
              className="px-6 py-2 bg-slate-200 text-obsidian-950 rounded hover:bg-white transition-colors text-sm font-bold uppercase tracking-wider"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;
