import React from "react";
import { 
  Flame, BookOpen, Clock, Award, Star, Trophy, Sparkles, BookMarked, 
  ChevronRight, PlayCircle, BarChart3, GraduationCap, CheckCircle 
} from "lucide-react";
import { Playlist, UserState, LeaderboardUser } from "../types";
import { SHADCN_LEADERBOARD_DATA } from "../data";
import Ads, { ADS_CONFIG } from "./Ads";

interface DashboardViewProps {
  userState: UserState;
  playlists: Playlist[];
  onSelectPlaylist: (playlist: Playlist) => void;
  onNavigate: (view: string) => void;
}

export default function DashboardView({ userState, playlists, onSelectPlaylist, onNavigate }: DashboardViewProps) {
  
  // Calculate analytics
  const levelNum = Math.floor(userState.xp / 1000) + 1;
  const progressToNextLevel = Math.round(((userState.xp % 1000) / 1000) * 100);

  // Compute total finished courses (100% video coverage)
  const completedTrackCount = playlists.filter((p) => {
    const ids = p.videos.map((vid) => `${p.id}-${vid.id}`);
    const completedList = ids.filter((id) => userState.completedVideoIds.includes(id));
    return completedList.length === p.videos.length && p.videos.length > 0;
  }).length;

  // Build simulated Leaderboard combining actual user with preloaded mock list
  const userRankEntry: LeaderboardUser = {
    rank: 4, // fits nicely in between Aarav(1) Priya(2) Kabir(3) (user) and Isha(5)... wait let's insert dynamically!
    name: userState.name,
    avatar: userState.avatar,
    xp: userState.xp,
    streak: userState.streak,
    isCurrentUser: true
  };

  const initialLeaderboard: LeaderboardUser[] = [
    { rank: 1, name: "Aarav Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav", xp: 14850, streak: 18 },
    { rank: 2, name: "Priya Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", xp: 12400, streak: 12 },
    { rank: 3, name: "Kabir Singh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir", xp: 11950, streak: 9 },
    userRankEntry,
    { rank: 5, name: "Isha Roy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isha", xp: 9800, streak: 15 },
    { rank: 6, name: "Rishabh Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rishabh", xp: 8750, streak: 5 }
  ];

  // Sort Leaderboard users cleanly by XP score
  const sortedLeaderboard = [...initialLeaderboard]
    .sort((a, b) => b.xp - a.xp)
    .map((usr, index) => {
      usr.rank = index + 1;
      return usr;
    });

  // Calculate percentage of finished videos
  const totalPlaylistVideosCount = playlists.reduce((acc, current) => acc + current.videos.length, 0);
  const totalCompletedVideosCount = userState.completedVideoIds.length;
  const overallCompletedRatio = totalPlaylistVideosCount > 0 
    ? Math.round((totalCompletedVideosCount / totalPlaylistVideosCount) * 100) 
    : 0;

  // Find recent learning video - we fetch the first video in "Internship 1" if emptywatchhistory
  let continueLearningVal: { playlist: Playlist, video: any, activeIdx: number } | null = null;
  if (userState.watchHistory && userState.watchHistory.length > 0) {
    const lastHistory = userState.watchHistory[0];
    const targetPlaylist = playlists.find(p => p.id === lastHistory.playlistId);
    if (targetPlaylist) {
      const targetVideoIdx = targetPlaylist.videos.findIndex(v => v.id === lastHistory.videoId);
      if (targetVideoIdx !== -1) {
        continueLearningVal = { playlist: targetPlaylist, video: targetPlaylist.videos[targetVideoIdx], activeIdx: targetVideoIdx };
      }
    }
  }

  // Fallback for continue learning (first lecture of Internship Playlist)
  if (!continueLearningVal && playlists.length > 0) {
    const p1 = playlists[0];
    continueLearningVal = { playlist: p1, video: p1.videos[0], activeIdx: 0 };
  }

  return (
    <div className="w-full text-left flex flex-col gap-8 font-sans select-none">
      
      {/* 1. Welcoming Hero Bar & streak tracking */}
      <div className="relative overflow-hidden glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="absolute right-0 top-0 -z-10 w-80 h-80 rounded-full bg-cyan-500/5 blur-[80px]" />
        
        <div className="text-left flex-1">
          <div className="inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Roj Study scholar portal
          </div>
          
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-white">
            Hello, <span className="text-cyan-400">{userState.name}</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            You have earned <span className="font-semibold text-white">{userState.xp} XP</span>. Accelerate your studies, write sandbox compiler experiments, and claim your physical graduation PDFs.
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 border-t border-white/5 pt-5 text-xs text-slate-400">
            <div>
              <span className="block text-[9px] text-slate-500 font-mono uppercase">programmer tier</span>
              <span className="text-slate-200 font-semibold flex items-center gap-1.5 mt-0.5"><Award className="h-4 w-4 text-cyan-400" /> level {levelNum} index</span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-500 font-mono uppercase">completions</span>
              <span className="text-slate-200 font-semibold flex items-center gap-1.5 mt-0.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> {totalCompletedVideosCount} lessons completed</span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-500 font-mono uppercase">academic credentials</span>
              <span className="text-slate-200 font-semibold flex items-center gap-1.5 mt-0.5"><GraduationCap className="h-4 w-4 text-indigo-400" /> {completedTrackCount} course certificates earned</span>
            </div>
          </div>
        </div>

        {/* Daily Streak Counter Widget block */}
        <div className="w-full md:w-56 bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex flex-col items-center justify-center shrink-0">
          <div className="bg-orange-500/15 p-3 rounded-full text-orange-500 animate-bounce" style={{ animationDuration: '2.5s' }}>
            <Flame className="h-7 w-7 text-orange-500 fill-current" />
          </div>
          <div className="font-display font-bold text-2xl text-white mt-2.5">
            {userState.streak} Day streak
          </div>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mt-1">Study consecutive days!</p>
        </div>
      </div>

      {/* 2. Middle Row: Continue Learning and Recommended Playlists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Playback Stage Continue & Recommended - 8 columns */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Continue learning panel */}
          {continueLearningVal && (
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5 text-left">
              <div className="flex items-center gap-4.5">
                <div className="bg-slate-950 px-3.5 py-4 rounded-xl relative overflow-hidden text-cyan-400 shrink-0 border border-slate-900 group cursor-pointer" onClick={() => onSelectPlaylist(continueLearningVal!.playlist)}>
                  <PlayCircle className="h-7 w-7 group-hover:scale-110 transition-transform text-[#06b6d4] fill-current" />
                </div>
                <div>
                  <span className="bg-slate-900 text-slate-400 font-mono text-[9px] py-0.5 px-2 rounded uppercase inline-block mb-1 border border-white/5 font-bold">
                    continue learning
                  </span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">{continueLearningVal.playlist.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 truncate max-w-sm sm:max-w-md">{continueLearningVal.video.title}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectPlaylist(continueLearningVal!.playlist)}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Watch Lesson</span>
                <ChevronRight className="h-4 w-4 text-cyan-500" />
              </button>
            </div>
          )}

          {/* Recommended Playlists module */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-display font-semibold text-lg text-white">Recommended Specialty Curriculum</h3>
              <p className="text-xs text-slate-400">Handpicked tracks matching your specialized development levels.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              {playlists.slice(0, 4).map((p) => {
                const listVideoIds = p.videos.map((vid) => `${p.id}-${vid.id}`);
                const completedInList = listVideoIds.filter((id) => userState.completedVideoIds.includes(id));
                const playlistProgressRate = p.videos.length > 0 
                  ? Math.round((completedInList.length / p.videos.length) * 100) 
                  : 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectPlaylist(p)}
                    className="group rounded-2xl glass-panel p-5 border border-white/5 hover:border-slate-800 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#06b6d4] mb-3 font-semibold uppercase">
                        <span>{p.category}</span>
                        <span>{p.videos.length} Lectures</span>
                      </div>

                      <h4 className="font-display font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors leading-tight">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug mt-2 line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5 italic">
                        <span>Progress Ratio</span>
                        <span>{playlistProgressRate}% ({completedInList.length}/{p.totalVideos})</span>
                      </div>
                      <div className="w-full bg-[#0b0b14]/90 rounded-full h-1 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${p.accentColor} transition-all duration-300`}
                          style={{ width: `${playlistProgressRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View Full library button */}
            <button
              onClick={() => onNavigate("playlists-library")}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 font-mono text-[11px] text-slate-300 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Explore All Playlists Module</span>
              <ChevronRight className="h-4 w-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Competitive Leaderboard & Accomplishments - 4 columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Progress gauge chart */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col text-left">
            <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              <span>Overall Academy Progress</span>
            </h4>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-bold text-white">{overallCompletedRatio}%</span>
              <span className="text-xs text-slate-400 font-mono">Lessons Covered</span>
            </div>

            <div className="w-full bg-[#0b0b14]/90 border border-white/5 rounded-full h-2 mt-3.5 mb-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 transition-all duration-300"
                style={{ width: `${overallCompletedRatio}%` }}
              />
            </div>
            
            <p className="text-[10px] leading-relaxed text-slate-500 font-mono mt-1">
              Total modules coverage tracks your physical ISO certificate download qualifications. Keep study schedule alive!
            </p>
          </div>

          {/* Student competitive tracking leaderboard list widget */}
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col text-left">
            <div className="bg-slate-950 px-4 py-3.5 border-b border-white/5 text-left flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">Academy Ranking</h3>
              </div>
              <span className="text-[9px] text-slate-500 font-mono">Real-time</span>
            </div>

            <div className="flex flex-col p-4 gap-3 select-none">
              {sortedLeaderboard.map((usr) => (
                <div 
                  key={usr.rank}
                  className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                    usr.isCurrentUser 
                      ? "bg-cyan-500/10 border border-cyan-500/20 shadow-sm" 
                      : "bg-slate-950/20 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                    <span className={`text-[10px] font-mono font-bold w-5 text-center ${usr.rank === 1 ? 'text-yellow-500' : usr.rank === 2 ? 'text-slate-300' : usr.rank === 3 ? 'text-amber-600' : 'text-slate-500'}`}>
                      {usr.rank}
                    </span>
                    <img 
                      src={usr.avatar} 
                      alt={usr.name} 
                      className="w-7 h-7 rounded-full bg-slate-950 border border-white/5 shrink-0" 
                    />
                    <div className="text-left font-sans truncate">
                      <h5 className={`text-xs font-semibold leading-tight truncate ${usr.isCurrentUser ? 'text-white' : 'text-slate-300'}`}>
                        {usr.name} {usr.isCurrentUser && "(You)"}
                      </h5>
                      <span className="text-[9px] text-slate-500 font-mono block">Streak: {usr.streak} days 🔥</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${usr.isCurrentUser ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {usr.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Desktop Google AdSense Column */}
          {ADS_CONFIG.ENABLE_ADS && (
            <Ads 
              id="adsense-dashboard-sidebar"
              type="sidebar"
            />
          )}
        </div>
      </div>
    </div>
  );
}
