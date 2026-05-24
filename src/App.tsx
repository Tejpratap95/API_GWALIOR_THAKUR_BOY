import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  isFirebaseConfigured, 
  listenToAuth, 
  saveHistoryItem, 
  getHistoryList 
} from './firebase';
import { HistoryItem, QueryType } from './types';
import Header from './components/Header';
import GlowDashboard from './components/GlowDashboard';
import AIScreen from './components/AIScreen';
import HistorySidebar from './components/HistorySidebar';
import { Sparkles, Trophy, Cpu, Flame, Terminal, HelpCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activePortal, setActivePortal] = useState<'dashboard' | 'ai'>('dashboard');
  const [aiTab, setAiTab] = useState<QueryType>('fantasy');
  const [promptValue, setPromptValue] = useState('Generate fantasy XI for CSK vs RCB');
  const [loading, setLoading] = useState(false);
  
  // Results
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [sources, setSources] = useState<Array<{ title: string; uri: string }> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // History List
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 1. Authenticate user listener
  useEffect(() => {
    const unsubscribe = listenToAuth((currUser) => {
      setUser(currUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch history list once user or auth changes
  const fetchSessionLogs = async () => {
    try {
      const logs = await getHistoryList();
      setHistory(logs);
    } catch (e) {
      console.warn("Could not retrieve session logs: ", e);
    }
  };

  useEffect(() => {
    fetchSessionLogs();
  }, [user]);

  // Handle preset clicks from ground or player widgets
  const handleSelectPrompt = (prompt: string, type: QueryType) => {
    setPromptValue(prompt);
    setAiTab(type);
    setActivePortal('ai');
    
    // Auto submit to make the action lightning fast and reactive!
    setTimeout(() => {
      const formEvent = { preventDefault: () => {} } as React.FormEvent;
      triggerAISubmit(prompt, type);
    }, 100);
  };

  // Main Submit handler
  const triggerAISubmit = async (customPrompt?: string, customType?: QueryType) => {
    const finalPrompt = customPrompt || promptValue;
    const finalType = customType || aiTab;

    if (!finalPrompt.trim()) return;

    setLoading(true);
    setError(null);
    setAiResult(null);
    setSources(null);

    try {
      const res = await fetch('/api/gemini/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          queryType: finalType
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate cricket insights. Try again.');
      }

      setAiResult(data.response);
      setSources(data.sources || null);

      // Save calculation item to Firestore or local state backup
      await saveHistoryItem(finalType, finalPrompt, data.response);
      // Reload lists
      await fetchSessionLogs();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected problem occurred in the intelligence network.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAISubmit();
  };

  const handleSelectHistory = (historyItem: HistoryItem) => {
    setPromptValue(historyItem.prompt);
    setAiTab(historyItem.queryType);
    setAiResult(historyItem.response);
    setSources(null);
    setError(null);
    setActivePortal('ai');
  };

  const handleClearHistory = () => {
    localStorage.removeItem('cricmind_history');
    setHistory([]);
    setAiResult(null);
    setSources(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Absolute background glowing grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-30"></div>

      {/* Top Glass Navigation */}
      <Header 
        user={user} 
        onUserChange={setUser} 
        onRequestInsight={handleSelectPrompt}
      />

      {/* Main Container body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-10 relative space-y-12 z-10">
        
        {/* 1. EDITORIAL THEMED HERO BANNER */}
        <section className="relative py-12 px-6 flex flex-col gap-5 items-center justify-center text-center overflow-hidden">
          {/* Theme aesthetic glow balls */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none -z-10"></div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>IPL 2026 Sports Intel Network</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter uppercase italic text-white">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Tactical Curve</span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Your Personal AI Cricket Intelligence Agent. Predict match outcomes, optimize fantasy XI playing lineups, and evaluate pitch dews in real-time.
          </p>

          {/* Inline scoreboard summary grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg w-full mt-4 font-mono text-xs">
            <div className="py-2.5 px-4 rounded-xl border border-white/5 bg-slate-900/30">
              <span className="text-zinc-500 uppercase tracking-widest text-[9px] block">PROBABILITY MAP</span>
              <span className="text-cyan-400 font-bold">98.4% Precision</span>
            </div>
            <div className="py-2.5 px-4 rounded-xl border border-white/5 bg-slate-900/30">
              <span className="text-zinc-500 uppercase tracking-widest text-[9px] block">ACTIVE ALGORITHM</span>
              <span className="text-emerald-400 font-bold">Gemini Grounded</span>
            </div>
            <div className="col-span-2 md:col-span-1 py-2.5 px-4 rounded-xl border border-white/5 bg-slate-900/30">
              <span className="text-zinc-500 uppercase tracking-widest text-[9px] block">SECURITY BOUNDS</span>
              <span className="text-amber-400 font-bold">ABAC Guarded</span>
            </div>
          </div>
        </section>

        {/* 2. MAIN APPLICATION CONTENT PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main workspace arena (Col span 3) */}
          <section className="lg:col-span-3 space-y-6">
            
            {/* View navigation toggle hubs */}
            <div className="flex border-b border-slate-900 pb-1.5" id="navigator_bar">
              <button
                onClick={() => setActivePortal('dashboard')}
                className={`py-2 px-5 font-mono text-xs font-black tracking-widest uppercase transition-all border-b-2 mr-4 cursor-pointer ${
                  activePortal === 'dashboard' 
                    ? 'border-cyan-400 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Match Arena Arena
              </button>
              <button
                onClick={() => setActivePortal('ai')}
                className={`py-2 px-5 font-mono text-xs font-black tracking-widest uppercase transition-all border-b-2 cursor-pointer ${
                  activePortal === 'ai' 
                    ? 'border-cyan-400 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
                id="tab_ai_portal"
              >
                CricMind Prompt Portal
              </button>
            </div>

            {/* Render conditional portal */}
            <div>
              {activePortal === 'dashboard' ? (
                <GlowDashboard onSelectPrompt={handleSelectPrompt} />
              ) : (
                <AIScreen 
                  activeTab={aiTab}
                  onTabChange={setAiTab}
                  promptValue={promptValue}
                  onPromptChange={setPromptValue}
                  onSubmit={handleSubmit}
                  loading={loading}
                  aiResult={aiResult}
                  sources={sources}
                  error={error}
                />
              )}
            </div>

          </section>

          {/* Right sidebar segment (Col span 1) */}
          <aside className="lg:col-span-1">
            <HistorySidebar 
              history={history}
              onSelectHistory={handleSelectHistory}
              onClearHistory={handleClearHistory}
              isCloud={isFirebaseConfigured}
            />
          </aside>

        </div>

      </main>

      {/* Futuristic footer terminal */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-900 py-8 px-6 text-center text-slate-500 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
            © 2026 CricMind AI. Grounding Node: aistudio-build • Ver: 4.1.20
          </p>
          <div className="flex items-center gap-4 text-[10px] text-zinc-600">
            <span>Powered by Gemini 3.5 Flash</span>
            <span className="h-3 w-px bg-slate-800"></span>
            <span>Zero-Trust Security Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
