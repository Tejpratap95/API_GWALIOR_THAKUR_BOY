import React from 'react';
import { IPL_TEAMS, RECENT_IPL_SCHEDULE } from '../data';
import { Calendar, CloudSun, Compass, ShieldAlert, Sparkles, Trophy, Users } from 'lucide-react';

interface GlowDashboardProps {
  onSelectPrompt: (prompt: string, type: 'fantasy' | 'prediction' | 'analysis' | 'insights' | 'chat') => void;
}

export default function GlowDashboard({ onSelectPrompt }: GlowDashboardProps) {
  return (
    <div className="space-y-8" id="glow_dashboard">
      
      {/* 1. Quick Match Analyzer Arena */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-black tracking-widest text-slate-100 uppercase font-mono">
            Upcoming Match Arena
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {RECENT_IPL_SCHEDULE.map((match) => {
            const home = IPL_TEAMS.find(t => t.id === match.homeTeam);
            const away = IPL_TEAMS.find(t => t.id === match.awayTeam);
            
            return (
              <div 
                key={match.matchId}
                className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-5 overflow-hidden group hover:border-cyan-500/40 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
              >
                {/* Neon ambient line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-green-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Match Info */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono tracking-widest bg-cyan-950 text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-800/20 uppercase">
                    IPL 2026
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {match.date}
                  </span>
                </div>

                {/* Faceoff */}
                <div className="flex items-center justify-between py-2 mb-4">
                  <div className="flex flex-col items-center gap-1.5 w-5/12 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-905 flex items-center justify-center text-2xl border border-slate-800 shadow-inner group-hover:scale-105 transition-transform bg-slate-900">
                      {home?.logo}
                    </div>
                    <span className="text-sm font-bold text-slate-200 uppercase font-mono tracking-tight">{home?.shortName}</span>
                    <span className="text-[10px] text-zinc-500 truncate w-full">{home?.name}</span>
                  </div>

                  <div className="w-2/12 flex flex-col items-center justify-center">
                    <span className="text-xs font-black italic text-cyan-400 font-mono tracking-widest bg-cyan-950/40 px-2 py-1 rounded bg-slate-900 border border-slate-850">
                      VS
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 w-5/12 text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-905 flex items-center justify-center text-2xl border border-slate-800 shadow-inner group-hover:scale-105 transition-transform bg-slate-900">
                      {away?.logo}
                    </div>
                    <span className="text-sm font-bold text-slate-200 uppercase font-mono tracking-tight">{away?.shortName}</span>
                    <span className="text-[10px] text-zinc-500 truncate w-full">{away?.name}</span>
                  </div>
                </div>

                {/* Ground */}
                <p className="text-xs text-slate-400 text-center font-mono mb-4 truncate italic">
                  📍 {match.venue}
                </p>

                {/* AI Action trigger hubs */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button 
                    onClick={() => onSelectPrompt(`Generate highly optimized fantasy XI for ${home?.shortName} vs ${away?.shortName} tonight`, 'fantasy')}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl hover:from-emerald-500 hover:to-green-500 hover:text-slate-950 transition-all cursor-pointer text-center"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate XI</span>
                  </button>
                  <button 
                    onClick={() => onSelectPrompt(`Provide a structured winner prediction percentage map for ${home?.shortName} vs ${away?.shortName} analysis`, 'prediction')}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold rounded-xl hover:from-cyan-500 hover:to-sky-500 hover:text-slate-950 transition-all cursor-pointer text-center"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Predict Win</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Pitch Analytics Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pitch report analyzer cards */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Compass className="w-5 h-5" />
            <h3 className="text-base font-bold tracking-widest uppercase font-mono text-slate-100">
              Futuristic Grounds & Pitches
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            Dew, wind factors, and ground parameters dictate up to 34% of IPL win weights. Tap a station target to evaluate specific telemetry indicators:
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => onSelectPrompt("What is the comprehensive pitch report and chase success coefficient at Wankhede Stadium Mumbai?", "insights")}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 text-left hover:bg-slate-900 transition-all"
            >
              <div>
                <span className="text-xs font-bold text-slate-200">Wankhede Stadium, Mumbai</span>
                <p className="text-[10px] text-zinc-500 font-mono">Bouncy clay pitch • Short straight boundaries • Heavy evening Dew</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/30 text-emerald-400">BAT FIRST?</span>
            </button>
            <button 
              onClick={() => onSelectPrompt("What is the pitch, standard scoring thresholds, and boundary metrics for M. Chinnaswamy Stadium, Bengaluru?", "insights")}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 text-left hover:bg-slate-900 transition-all"
            >
              <div>
                <span className="text-xs font-bold text-slate-200">M. Chinnaswamy Stadium, Bengaluru</span>
                <p className="text-[10px] text-zinc-500 font-mono">Flat batter paradise • High altitude • Average score 190+</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/30 text-emerald-400">HIGH RUNS</span>
            </button>
            <button 
              onClick={() => onSelectPrompt("Analyze the pitch reports, dry wear, and spin grip performance index of Eden Gardens, Kolkata matches", "insights")}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 text-left hover:bg-slate-900 transition-all"
            >
              <div>
                <span className="text-xs font-bold text-slate-200">Eden Gardens, Kolkata</span>
                <p className="text-[10px] text-zinc-500 font-mono">Slow turns later • Grass coverage • Fast outfield speed</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-800/30 text-amber-400">SPIN EDGE</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tactician Profile Analysis */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
              <Users className="w-5 h-5" />
              <h3 className="text-base font-bold tracking-widest uppercase font-mono text-slate-100">
                Strategic Player Match-Ups
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              CricMind AI simulates individual player face-offs or current grade forms. Run immediate tactical evaluations:
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => onSelectPrompt("Perform player analysis for Virat Kohli against Sunil Narine spin matchups", "analysis")}
                className="p-3 text-center rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-900 transition-all text-xs font-bold text-slate-300"
              >
                Kohli vs Narine
              </button>
              <button 
                onClick={() => onSelectPrompt("Analyze Jasprit Bumrah Yorker efficiency in death overs in current IPL", "analysis")}
                className="p-3 text-center rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-900 transition-all text-xs font-bold text-slate-300"
              >
                Bumrah Death Stats
              </button>
              <button 
                onClick={() => onSelectPrompt("Evaluate Travis Head batting explosiveness in primary Powerplays", "analysis")}
                className="p-3 text-center rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-900 transition-all text-xs font-bold text-slate-300"
              >
                Travis Head Form
              </button>
              <button 
                onClick={() => onSelectPrompt("Evaluate Heinrich Klaasen versus wrist spin bowler match-ups", "analysis")}
                className="p-3 text-center rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-900 transition-all text-xs font-bold text-slate-300"
              >
                Klaasen vs Spin
              </button>
            </div>
          </div>
          <div className="p-3.5 bg-cyan-950/10 border border-cyan-500/20 rounded-xl flex items-center gap-3">
            <CloudSun className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-[10px] text-cyan-300 leading-relaxed font-mono">
              PRO TIP: Set search coordinates using the Gemini chat node to pull weather reports during real IPL 2026 dates!
            </span>
          </div>
        </div>
      </div>

      {/* 3. Meet the Squads Segment */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black tracking-widest text-slate-100 uppercase font-mono">
            Intelligence Database Squads
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {IPL_TEAMS.map((team) => (
            <div 
              key={team.id}
              className="rounded-xl border border-slate-800 p-4 bg-slate-900/35 hover:bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col items-center text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {team.logo}
              </div>
              <h4 className="text-xs font-bold text-slate-200">{team.shortName}</h4>
              <p className="text-[9px] text-zinc-500 max-w-full truncate">{team.name}</p>
              
              <button 
                onClick={() => onSelectPrompt(`Generate best combinations and strategy using key players ${team.keyPlayers.join(', ')} of ${team.shortName}`, 'fantasy')}
                className="mt-3 text-[9px] font-mono font-bold text-cyan-400 group-hover:underline uppercase tracking-wider"
              >
                Analyze Core Team
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
