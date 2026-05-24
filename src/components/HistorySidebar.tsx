import React from 'react';
import { HistoryItem } from '../types';
import { Clock, History, Cloud, CloudOff, AlertCircle, FileText, Sparkles, Trophy, UserSearch, Compass, MessageSquare } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  isCloud: boolean;
}

export default function HistorySidebar({ history, onSelectHistory, onClearHistory, isCloud }: HistorySidebarProps) {
  
  const getQueryIcon = (type: string) => {
    switch(type) {
      case 'fantasy': return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      case 'prediction': return <Trophy className="w-3.5 h-3.5 text-cyan-400" />;
      case 'analysis': return <UserSearch className="w-3.5 h-3.5 text-indigo-400" />;
      case 'insights': return <Compass className="w-3.5 h-3.5 text-pink-400" />;
      default: return <MessageSquare className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const getFriendlyType = (type: string) => {
    switch(type) {
      case 'fantasy': return "FANTASY XI";
      case 'prediction': return "WINNER PREDICT";
      case 'analysis': return "PLAYER FORM";
      case 'insights': return "PITCH & CONDS";
      default: return "AI CHAT";
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-5 flex flex-col justify-between h-full min-h-[440px]" id="history_sidebar_container">
      {/* Upper part */}
      <div className="space-y-4">
        {/* Header Title list */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 text-slate-200">
            <History className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black tracking-widest font-mono uppercase">
              CricMind Logs
            </span>
          </div>

          {/* Sync indicator */}
          <div className="flex items-center gap-1">
            {isCloud ? (
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono" title="Cloud Database Connection Live">
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>SYNCED</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] text-amber-400 font-mono" title="Sandbox Offline storage active">
                <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                <span>LOCAL</span>
              </div>
            )}
          </div>
        </div>

        {/* History records */}
        <div className="space-y-2 h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
              <Clock className="w-8 h-8 text-neutral-600 mb-2 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider block">No past sessions</span>
              <p className="text-[10px] text-zinc-500 max-w-[180px] mt-1 leading-relaxed">
                Run an AI calculation above to log findings dynamically
              </p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHistory(item)}
                className="w-full p-3 rounded-xl bg-slate-950/40 border border-slate-850 hover:bg-slate-950 hover:border-cyan-400/20 text-left transition-all group flex flex-col gap-1 text-xs cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  {getQueryIcon(item.queryType)}
                  <span className="text-[9px] font-mono font-extrabold tracking-wider text-slate-400 uppercase">
                    {getFriendlyType(item.queryType)}
                  </span>
                </div>
                <p className="text-slate-200 font-medium truncate w-full group-hover:text-cyan-400 transition-colors">
                  {item.prompt}
                </p>
                <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
                  {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just Now"}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Clear/Wipe Session Logs */}
      {history.length > 0 && (
        <div className="pt-3 border-t border-slate-900 block mt-4">
          <button
            onClick={onClearHistory}
            className="w-full py-2 bg-slate-950 text-slate-400 text-[10px] font-mono uppercase rounded-lg border border-slate-850 hover:border-red-900/40 hover:text-red-400 transition-all cursor-pointer text-center"
            id="btn_clear_history"
          >
            Clear Session Logs
          </button>
        </div>
      )}
    </div>
  );
}
