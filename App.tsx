import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import OutputDisplay from './components/OutputDisplay';
import { sanitizePrompt } from './services/geminiService';
import { SafetyStatus, SanitizeResult } from './types';
import { ChevronRight, Zap } from 'lucide-react';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<SanitizeResult | null>(null);
  const [status, setStatus] = useState<SafetyStatus>(SafetyStatus.IDLE);

  const handleProcess = useCallback(async () => {
    if (!inputText.trim()) return;

    setStatus(SafetyStatus.PROCESSING);
    setResult(null);

    try {
      const sanitizedData = await sanitizePrompt(inputText);
      setResult(sanitizedData);
      setStatus(SafetyStatus.SAFE);
    } catch (error) {
      console.error(error);
      setStatus(SafetyStatus.ERROR);
    }
  }, [inputText]);

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setStatus(SafetyStatus.IDLE);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-200">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-6 relative z-10">
        
        {/* Left Column: Input */}
        <section className="flex-1 min-h-[500px] flex flex-col gap-4">
          <PromptInput 
            value={inputText}
            onChange={setInputText}
            onClear={handleClear}
            onSubmit={handleProcess}
            isProcessing={status === SafetyStatus.PROCESSING}
          />
          
          <div className="flex justify-end lg:hidden">
            <button
              onClick={handleProcess}
              disabled={!inputText.trim() || status === SafetyStatus.PROCESSING}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider shadow-lg transition-all
                ${!inputText.trim() || status === SafetyStatus.PROCESSING
                  ? 'bg-obsidian-800 text-slate-600 border border-obsidian-700'
                  : 'bg-electric-blue text-white shadow-electric-blue/20 hover:bg-blue-500'
                }`}
            >
              {status === SafetyStatus.PROCESSING ? 'Processing...' : 'Execute'}
              <Zap size={16} />
            </button>
          </div>
        </section>

        {/* Center Action (Desktop) */}
        <div className="hidden lg:flex flex-col justify-center items-center px-2">
           <button
              onClick={handleProcess}
              disabled={!inputText.trim() || status === SafetyStatus.PROCESSING}
              className={`group p-4 rounded-full transition-all duration-300 transform shadow-2xl relative
                ${!inputText.trim() || status === SafetyStatus.PROCESSING
                  ? 'bg-obsidian-800 text-slate-700 border border-obsidian-700 cursor-not-allowed'
                  : 'bg-electric-blue text-white hover:scale-110 shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-400'
                }`}
            >
              {status === SafetyStatus.PROCESSING 
                  ? <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div> 
                  : <ChevronRight size={28} className={inputText.trim() ? "group-hover:translate-x-0.5 transition-transform" : ""} />
              }
           </button>
        </div>

        {/* Right Column: Output */}
        <section className="flex-1 min-h-[500px]">
          <OutputDisplay 
            status={status}
            result={result}
            onRetry={handleProcess}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-obsidian-800 mt-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-medium">
          <p>© {new Date().getFullYear()} VisionForge AI. All rights reserved.</p>
          <div className="flex gap-6">
             <span className="hover:text-electric-cyan transition-colors cursor-pointer">System Status: Online</span>
             <span className="hover:text-electric-cyan transition-colors cursor-pointer">Version 3.0.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
};