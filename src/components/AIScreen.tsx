import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { PRESET_PROMPTS } from '../data';
import { 
  Sparkles, 
  Trophy, 
  UserSearch, 
  MessageSquare, 
  Compass, 
  Send, 
  Copy, 
  Check, 
  Globe, 
  Loader2, 
  AlertTriangle 
} from 'lucide-react';

interface AIScreenProps {
  activeTab: 'fantasy' | 'prediction' | 'analysis' | 'insights' | 'chat';
  onTabChange: (tab: 'fantasy' | 'prediction' | 'analysis' | 'insights' | 'chat') => void;
  promptValue: string;
  onPromptChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  aiResult: string | null;
  sources: Array<{ title: string; uri: string }> | null;
  error: string | null;
}

export default function AIScreen({
  activeTab,
  onTabChange,
  promptValue,
  onPromptChange,
  onSubmit,
  loading,
  aiResult,
  sources,
  error
}: AIScreenProps) {
  const [copied, setCopied] = React.useState(false);
  const [loadingStep, setLoadingStep] = React.useState(0);
  const resultEndRef = useRef<HTMLDivElement>(null);

  const loaderSteps = [
    "Spinning up CricMind AI intelligence engine...",
    "Querying Google Search grounding indexing databases...",
    "Retrieving active playing squads and recent forms...",
    "Simulating batter-bowler match-ups in current pitch environment...",
    "Optimizing fantasy multiplier targets & suggestions...",
    "Assembling strategic logical summary reports..."
  ];

  // Rotate loading text messages every few seconds
  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loaderSteps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Scroll to response on update
  useEffect(() => {
    if (aiResult || error) {
      resultEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiResult, error]);

  const handleCopy = () => {
    if (aiResult) {
      navigator.clipboard.writeText(aiResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTabUI = (tabName: string, icon: any, label: string) => {
    const isActive = activeTab === tabName;
    return (
      <button
        key={tabName}
        onClick={() => {
          onTabChange(tabName as any);
          // Set standard default prompt on tab change if empty
          const presets = PRESET_PROMPTS[tabName as keyof typeof PRESET_PROMPTS];
          if (presets && presets.length > 0) {
            onPromptChange(presets[0].prompt);
          }
        }}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-extrabold cursor-pointer border transition-all ${
          isActive 
            ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
            : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  const activePresets = PRESET_PROMPTS[activeTab as keyof typeof PRESET_PROMPTS] || [];

  return (
    <div className="grid grid-cols-1 gap-6" id="ai_screener">
      {/* 1. Interactive Intelligence Categories */}
      <div className="flex flex-wrap gap-2.5 pb-2 border-b border-slate-900">
        {getTabUI('fantasy', <Sparkles className="w-4 h-4 text-emerald-400" />, 'Fantasy Companion')}
        {getTabUI('prediction', <Trophy className="w-4 h-4 text-cyan-400" />, 'Predict Winner')}
        {getTabUI('analysis', <UserSearch className="w-4 h-4 text-indigo-400" />, 'Player Analysis')}
        {getTabUI('insights', <Compass className="w-4 h-4 text-pink-400" />, 'Pitch & Conditions')}
        {getTabUI('chat', <MessageSquare className="w-4 h-4 text-sky-400" />, 'Tactical Agent Chat')}
      </div>

      {/* 2. Selection suggestions & Presets */}
      <div>
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-2.5">
          Select Recommended Strategy Node:
        </span>
        <div className="flex flex-wrap gap-2">
          {activePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onPromptChange(preset.prompt)}
              className="px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer font-medium"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Prompt Input Workspace */}
      <form onSubmit={onSubmit} className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 opacity-40"></div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Tactical Input Workspace
          </label>
          <span className="text-[10px] font-mono text-emerald-400 py-0.5 px-2 bg-emerald-950/40 border border-emerald-900/30 rounded uppercase">
            GE Grounding Trigger Enabled
          </span>
        </div>

        <div className="relative mt-2 flex items-center">
          <textarea
            value={promptValue}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Type player, matchup, ground details or enter a preset request above..."
            className="w-full bg-slate-950 text-slate-100 rounded-xl border border-slate-800 py-4.5 pl-4 pr-16 text-sm focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 font-sans resize-none min-h-[90px]"
            id="prompt_input"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !promptValue.trim()}
            className="absolute right-3.5 bottom-3.5 p-3 rounded-lg bg-cyan-500 text-slate-950 font-black tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:brightness-115 disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none active:scale-95 transition-all text-black cursor-pointer"
            id="btn_generate_insights"
            title="Generate AI Insights"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* 4. Response Section containing visualizer and citations */}
      {(loading || aiResult || error) && (
        <div className="relative rounded-2xl bg-slate-900/40 border border-slate-800 p-6 overflow-hidden min-h-[140px]" id="insight_report">
          {/* Ambient header line for findings */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-500/40"></div>

          {/* Loading Animation and rotating high-tech steps */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center" id="animation_loading">
              <div className="relative flex items-center justify-center mb-6">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                <Sparkles className="w-5 h-5 text-emerald-400 absolute animate-pulse" />
              </div>
              <p className="text-sm font-bold text-slate-300 font-mono tracking-wide max-w-md animate-pulse">
                {loaderSteps[loadingStep]}
              </p>
              <div className="mt-3 flex gap-1 justify-center">
                {loaderSteps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      i === loadingStep ? 'bg-cyan-400 w-4' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Error Prompt Guard */}
          {error && !loading && (
            <div className="flex items-start gap-3 bg-red-950/20 border border-red-900/40 p-4 rounded-xl text-red-400" id="error_container">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">CricMind AI Engine Blocked</h4>
                <p className="text-xs text-red-400/80 mt-1 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Render Insights Findings */}
          {aiResult && !loading && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <h3 className="text-sm font-black tracking-widest font-mono text-emerald-400 uppercase">
                    AI CRICMIND REPORT FINDINGS
                  </h3>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 py-1 px-3.5 bg-slate-950 border border-slate-850 rounded-lg hover:border-slate-700 text-slate-300 font-mono text-[10px] cursor-pointer"
                  title="Copy Report"
                  id="btn_copy_report"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY MARKDOWN</span>
                    </>
                  )}
                </button>
              </div>

              {/* Strict div wrapper as required by frameworks guidelines */}
              <div className="markdown-body text-slate-200 prose prose-invert max-w-none text-sm leading-relaxed space-y-4 font-sans overflow-x-auto">
                <ReactMarkdown>{aiResult}</ReactMarkdown>
              </div>

              {/* Grounding Source citations if available */}
              {sources && sources.length > 0 && (
                <div className="pt-4 border-t border-slate-800 block">
                  <div className="flex items-center gap-1.5 text-cyan-400 mb-2.5">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase tracking-wider font-extrabold">
                      Live Search Grounding References:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-950 hover:border-cyan-400/40 text-cyan-300 border border-slate-850 text-xs font-mono font-medium max-w-[240px] truncate block"
                      >
                        🔗 {src.title || "Linked Source Analysis"}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scroll anchor target */}
          <div ref={resultEndRef} />
        </div>
      )}
    </div>
  );
}
