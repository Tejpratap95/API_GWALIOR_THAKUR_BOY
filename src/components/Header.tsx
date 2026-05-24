import React from 'react';
import { User } from 'firebase/auth';
import { ShieldAlert, Sparkles, LogIn, LogOut, Cpu, TrendingUp } from 'lucide-react';
import { isFirebaseConfigured, loginWithGoogle, logoutUser } from '../firebase';

interface HeaderProps {
  user: User | null;
  onUserChange: (user: User | null) => void;
  onRequestInsight: (prompt: string, type: 'fantasy' | 'prediction' | 'analysis' | 'insights' | 'chat') => void;
}

export default function Header({ user, onUserChange, onRequestInsight }: HeaderProps) {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const u = await loginWithGoogle();
      onUserChange(u);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      onUserChange(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/50 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between" id="app_header">
      {/* Brand Logo & Tag */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-emerald-450 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          <Cpu className="w-4 h-4 text-slate-950" />
        </div>
        <div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
            CricMind<span className="text-cyan-400">AI</span>
          </span>
        </div>
      </div>

      {/* Center Cricket Quick Stats/Scores Simulation */}
      <div className="hidden lg:flex items-center gap-4 py-1.5 px-4 rounded-full border border-white/10 bg-white/5 text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-200">LIVE: RCB vs CSK</span>
        </div>
        <div className="h-4 w-px bg-white/10"></div>
        <button 
          onClick={() => onRequestInsight("Analyze latest IPL matches and form metrics", "insights")}
          className="flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium tracking-wider uppercase transition-all"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Quick Match Intelligence</span>
        </button>
      </div>

      {/* Right side operations */}
      <div className="flex items-center gap-4">
        {/* Firestore Offline Indicator warning */}
        {!isFirebaseConfigured && (
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] px-2.5 py-1 rounded-lg font-mono">
            <ShieldAlert className="w-3 h-3 text-amber-400 animate-bounce" />
            <span className="hidden sm:inline">SANDBOX SANDBOX MODE</span>
          </div>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            {/* User Profile Info */}
            <div className="flex flex-col items-end text-right">
              <span className="text-xs text-slate-200 font-medium max-w-[120px] truncate">
                {user.displayName || user.email}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                CRICKETER
              </span>
            </div>
            
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile Avatar" 
                className="w-8 h-8 rounded-full border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-cyan-400 border border-cyan-500/30">
                {(user.displayName || 'U')[0].toUpperCase()}
              </div>
            )}

            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950/30 hover:text-red-400 text-slate-400 border border-slate-800 hover:border-red-900/40 transition-all cursor-pointer"
              title="Logout"
              id="btn_logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-95 transition-all text-black cursor-pointer"
            id="btn_login"
          >
            <LogIn className="w-4 h-4" />
            <span>Connect Profile</span>
          </button>
        )}
      </div>
    </header>
  );
}
