import React, { useState } from "react";
import { User, Shield, GraduationCap, Calendar, Mail, Edit2, CheckCircle, Award, AwardIcon, Lock, Sparkles, Download, ChevronLeft } from "lucide-react";
import { UserState, Playlist } from "../types";

interface ProfileViewProps {
  userState: UserState;
  playlists: Playlist[];
  onUpdateName: (name: string, bio: string, avatar: string) => void;
  onOpenCertificate: (playlistId: string) => void;
  onBack?: () => void;
}

export default function ProfileView({ userState, playlists, onUpdateName, onOpenCertificate, onBack }: ProfileViewProps) {
  const [name, setName] = useState(userState.name);
  const [bio, setBio] = useState(userState.bio);
  const [avatar, setAvatar] = useState(userState.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password fields
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  const presetAvatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Nikita",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
  ];

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateName(name, bio, avatar);
    setIsEditing(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handlePassChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass) return;
    setPassSuccess("Simulated Password updated successfully inside secure browser session tier! ✅");
    setCurrPass("");
    setNewPass("");
    setTimeout(() => setPassSuccess(""), 4000);
  };

  // Find completed playlists
  const computedListProgress = playlists.map((p) => {
    const listVideoIds = p.videos.map((vid) => `${p.id}-${vid.id}`);
    const completedInList = listVideoIds.filter((id) => userState.completedVideoIds.includes(id));
    const completionPercentage = p.videos.length > 0 
      ? Math.round((completedInList.length / p.videos.length) * 100) 
      : 0;
    
    return {
      playlist: p,
      percentage: completionPercentage,
      completedCount: completedInList.length,
      isFinished: completionPercentage === 100
    };
  });

  return (
    <div className="w-full text-left max-w-5xl mx-auto py-4 flex flex-col gap-6 font-sans select-none">
      {onBack && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-white font-mono font-bold tracking-wider transition-all group bg-slate-900/60 hover:bg-slate-800/85 border border-white/5 px-4 py-2 rounded-xl cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>BACK TO DASHBOARD</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* LEFT AREA: User brief & Profile edit */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 to-indigo-600"></div>

          <img 
            src={avatar} 
            alt={userState.name} 
            className="w-24 h-24 rounded-full border-4 border-cyan-500/20 bg-slate-950 shadow-xl shadow-cyan-950/40 relative mt-4 cursor-pointer hover:scale-105 transition-transform" 
            title="Click Edit to customize avatar"
          />

          {!isEditing ? (
            <div className="mt-4 flex flex-col gap-1 w-full">
              <h3 className="font-display font-bold text-lg text-white flex items-center justify-center gap-1.5">
                {userState.name}
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="p-1 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </h3>
              <p className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase font-semibold">level {Math.floor(userState.xp / 1000) + 1} programmer</p>
              <p className="text-xs text-slate-400 leading-relaxed italic border-t border-white/5 mt-4 pt-3">
                &ldquo;{userState.bio || "No professional summary bio set yet. Click Edit to customize."}&rdquo;
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="mt-4 flex flex-col gap-4 text-left w-full border-t border-white/5 pt-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Learner Username</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#11111d] border border-white/10 rounded-xl py-2 px-3 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Biography</label>
                <textarea 
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#11111d] border border-white/10 rounded-xl py-2 px-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 scrollbar"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">Select Avatar Preset</label>
                <div className="grid grid-cols-6 gap-2">
                  {presetAvatars.map((av) => (
                    <img 
                      key={av} 
                      onClick={() => setAvatar(av)}
                      src={av} 
                      alt="Preset avatar" 
                      className={`w-8 h-8 rounded-full bg-slate-950 border cursor-pointer transition-all ${avatar === av ? 'border-cyan-400 scale-110 shadow shadow-cyan-900' : 'border-white/5 hover:border-slate-500'}`} 
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 mt-2 text-xs">
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold py-2 rounded-xl text-center active:scale-95 transition-transform cursor-pointer"
                >
                  Save Profile
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-[#ffffff20] text-slate-400 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {isSuccess && (
            <div className="mt-4 text-[10px] bg-emerald-950/40 p-2 text-emerald-400 border border-emerald-800/30 font-mono rounded-lg w-full">
              Learner Profile modified successfully!
            </div>
          )}
        </div>

        {/* Change password simulated section */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-4 text-left">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Lock className="h-4 w-4 text-indigo-400" />
            <h4 className="text-xs font-semibold text-white tracking-wide uppercase">Password Security</h4>
          </div>

          <form onSubmit={handlePassChange} className="flex flex-col gap-3">
            <div>
              <label className="text-[9px] font-mono text-slate-500 block">CURRENT PASSWORD</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={currPass}
                onChange={(e) => setCurrPass(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/5 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-700 font-mono"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-slate-500 block">NEW SECURE PASSWORD</label>
              <input 
                type="password" 
                placeholder="Enter new pass"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/5 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-700 font-mono"
              />
            </div>

            <button 
              type="submit" 
              disabled={!currPass || !newPass}
              className="bg-slate-900 border border-white/5 text-[10px] text-slate-300 hover:text-white hover:bg-slate-800 font-mono py-2 rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:hover:bg-slate-900 disabled:hover:text-slate-300"
            >
              Update Credentials
            </button>

            {passSuccess && (
              <div className="text-[9px] text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-900 font-mono leading-relaxed mt-2 text-center">
                {passSuccess}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* RIGHT AREA: Stats dashboard & Earned certificates */}
      <div className="lg:col-span-8 flex flex-col gap-8 text-left">
        {/* Dynamic Learning Statistics Dashboard with customized inline SVG charts */}
        <div>
          <h3 className="font-display font-semibold text-lg text-white">Visual Performance Matrix</h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time stats based on your code compilations and completed modules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* XP & BADGES METRICS */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-4">Total Accrued Experience</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-bold text-cyan-400">{userState.xp}</span>
                <span className="text-sm font-mono text-slate-400">Total Points</span>
              </div>
            </div>

            {/* Custom SVG Performance Area Chart */}
            <div className="mt-4 bg-slate-950/40 p-3 rounded-xl border border-white/5 relative">
              <div className="absolute top-2 right-3 text-[9px] font-mono text-slate-500">weekly progress</div>
              <svg viewBox="0 0 300 80" className="w-full h-16 overflow-visible select-none pr-2">
                <defs>
                  <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 70 Q 50 40 100 65 T 200 20 T 300 10 L 300 80 L 0 80 Z" fill="url(#area-gradient)" />
                <path d="M 0 70 Q 50 40 100 65 T 200 20 T 300 10" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
                <circle cx="300" cy="10" r="4.5" fill="#06b6d4" className="animate-pulse" />
              </svg>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun (Current)</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-4">Unlocked Badges</h4>
              <div className="flex flex-wrap gap-2">
                {userState.xp >= 100 && (
                  <span className="inline-flex items-center gap-1 bg-[#06b6d4]/10 border border-[#06b6d4]/20 rounded-lg px-2.5 py-1 text-[10px] font-mono text-[#06b6d4] font-medium uppercase font-sans">
                    <Sparkles className="h-3 w-3 shrink-0" /> Web Starter
                  </span>
                )}
                {userState.xp >= 300 && (
                  <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 rounded-lg px-2.5 py-1 text-[10px] font-mono text-purple-400 font-medium uppercase font-sans">
                    <CheckCircle className="h-3 w-3 shrink-0" /> Active Coder
                  </span>
                )}
                {userState.completedVideoIds.length >= 1 && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 text-[10px] font-mono text-amber-400 font-medium uppercase font-sans">
                    <Award className="h-3 w-3 shrink-0" /> Certificate Graduate
                  </span>
                )}
                {userState.streak >= 3 && (
                  <span className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2.5 py-1 text-[10px] font-mono text-orange-400 font-medium uppercase font-sans">
                    🔥 3+ Daily Streak
                  </span>
                )}
                <span className="inline-flex items-center gap-1 bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-[10px] font-mono text-slate-500 uppercase">
                  Locked Badges (3/6)
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs bg-[#0b0b14]/50 border border-white/5 p-3 rounded-xl font-mono text-slate-400">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-indigo-400" /> Member since</span>
              <span>May 2026</span>
            </div>
          </div>
        </div>

        {/* Certificate Unlocking progress tracker list */}
        <div className="flex flex-col gap-4">
          <div className="border-b border-white/5 pb-3">
            <h4 className="text-xs font-semibold text-white tracking-wide uppercase flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-[#e879f9]" />
              <span>Course Certificates Status ({computedListProgress.filter(c => c.isFinished).length} Unlocked)</span>
            </h4>
          </div>

          <div className="flex flex-col gap-3">
            {computedListProgress.map(({ playlist, percentage, completedCount, isFinished }) => (
              <div 
                key={playlist.id} 
                className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="text-left font-sans flex-1">
                  <h5 className="text-xs font-bold text-white leading-snug">{playlist.title}</h5>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Completed lessons: {completedCount} / {playlist.totalVideos}</p>
                  
                  {/* Progress bar graph */}
                  <div className="w-full bg-slate-950/80 rounded-full h-1.5 mt-2 overflow-hidden border border-white/5 max-w-sm">
                    <div 
                      className={`h-full bg-gradient-to-r ${playlist.accentColor} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3.5 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-slate-300">{percentage}%</span>
                  
                  {isFinished ? (
                    <button
                      onClick={() => onOpenCertificate(playlist.id)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-[10px] font-mono px-3.5 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1 shadow-md shadow-emerald-950/30 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-950 shrink-0" />
                      Get PDF Certificate
                    </button>
                  ) : (
                    <div className="bg-[#121222] border border-white/5 text-slate-500 font-mono text-[9px] py-1 px-2.5 rounded">
                      Locked
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
