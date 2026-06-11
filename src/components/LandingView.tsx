import React, { useState } from "react";
import { 
  Sparkles, Play, Search, Code, Award, Users, BookOpen, 
  HelpCircle, ChevronDown, Flame, Trophy, Shield, ExternalLink
} from "lucide-react";
import { Playlist } from "../types";

interface LandingViewProps {
  playlists: Playlist[];
  onExplorePlaylist: (playlist: Playlist) => void;
  onNavigate: (view: string) => void;
  onBeginLearning: () => void;
}

export default function LandingView({ playlists, onExplorePlaylist, onNavigate, onBeginLearning }: LandingViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const filteredPlaylists = playlists.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { value: "50,000+", label: "Active Learners", icon: Users, color: "text-cyan-400 bg-cyan-500/10" },
    { value: "7 Major", label: "Specializations", icon: BookOpen, color: "text-indigo-400 bg-indigo-500/10" },
    { value: "135+", icon: Play, label: "Guided Videos", color: "text-pink-400 bg-pink-500/10" },
    { value: "No Setup", icon: Code, label: "Web Coding Sandbox", color: "text-emerald-400 bg-emerald-500/10" }
  ];

  const faqs = [
    {
      question: "Is Roj Study completely free to access?",
      answer: "Yes, 100%! Roj Study is a free-access learning academy. You can watch any YouTube playlist, interact with the in-browser live-rendering playgrounds, run programming tutorials, track your scores, and generate certificates entirely at zero cost."
    },
    {
      question: "How does the built-in VS Code-inspired coding editor function?",
      answer: "Below every programming video we have built an elegant, integrated multi-tab coding sandbox (HTML, CSS, JavaScript). You can write custom markup and script logic directly, select 'Run Code', and see live responsive iframe outputs instantaneously without setting up massive IDE frameworks on your hard drive!"
    },
    {
      question: "How do I unlock and download my verified course certificates?",
      answer: "Once you log in, our system monitors your progress in every specialized playlist. When you mark 100% of the videos in any playlist as 'Completed' and achieve satisfactory progress, a professional PDF certificate generates automatically under your profile with a uniquely verified ID, dates, and graduation stamp."
    },
    {
      question: "Can I customize course videos or link my own materials?",
      answer: "Absolutely! We provide a customized 'Admin Panel' inside the member dashboard. Learners or tutors can register custom YouTube video links, titles, and descriptions dynamically inside their local browser environment to easily create custom watch-lists."
    }
  ];

  return (
    <div className="w-full pb-12 flex flex-col gap-20">
      {/* 1. Cyber Hero Area */}
      <section className="relative overflow-hidden pt-12 md:pt-20 px-4 sm:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Glow effect vectors in background */}
        <div className="absolute right-0 top-0 -z-10 w-96 h-96 rounded-full bg-indigo-600/10 blur-[100px] cyber-glow"></div>
        <div className="absolute left-10 bottom-0 -z-10 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] cyber-glow" style={{ animationDelay: '1.5s' }}></div>

        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-1.5 px-4 text-xs font-semibold tracking-wide text-cyan-400 self-start">
            <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>Futuristic E-Learning Paradigm</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Learn and Code <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              In Real Time.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Welcome to <span className="font-semibold text-white">Roj Study</span>, where premium YouTube tutorials combine with VS Code-inspired coding playpens, verified graduation credentials, and a global student workspace chat.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <button
              onClick={onBeginLearning}
              className="w-full sm:w-auto bg-gradient-to-r from-[#06b6d4] to-[#6366f1] hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all text-center cursor-pointer"
            >
              Begin Free Learning
            </button>
            <button
              onClick={() => {
                const specSection = document.getElementById("tracks-grid");
                specSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-slate-700 text-[#cbd5e1] hover:text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="h-4 w-4 text-indigo-400 shrink-0" />
              Explore Specialty Playlists
            </button>
          </div>

          {/* Quick inline feature tags */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-white/5 mt-4 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-emerald-400" /> Fully Responsive UI</span>
            <span className="flex items-center gap-1"><Code className="h-3.5 w-3.5 text-cyan-400" /> Interactive Compiler</span>
            <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5 text-yellow-400" /> One-Click CV PDF downloads</span>
          </div>
        </div>

        {/* Hero visual mock banner */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-500 opacity-20 blur-xl"></div>
          <div className="relative glass-panel rounded-2xl p-5 border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">rojstudy_sandbox.tsx</span>
            </div>

            {/* Simulated Live Player Preview */}
            <div className="relative bg-black/50 aspect-video rounded-xl overflow-hidden border border-white/5 flex items-center justify-center group">
              <img 
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop" 
                alt="Workspace preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black px-4 py-3 flex flex-col justify-between">
                <div className="bg-slate-900/65 py-0.5 px-2 rounded text-[10px] font-semibold text-cyan-400 self-start border border-cyan-500/20">
                  Interactive Compiler Active
                </div>
                <div>
                  <h4 className="text-[11px] font-mono text-[#cbd5e1]">Playing Now:</h4>
                  <p className="text-xs font-semibold text-white truncate">React Custom Hooks & Component Architecture</p>
                </div>
              </div>
              <div className="z-10 bg-gradient-to-tr from-cyan-500 to-indigo-600 h-11 w-11 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer group-hover:scale-110 active:scale-95 transition-all">
                <Play className="h-5 w-5 fill-white" />
              </div>
            </div>

            {/* Simulating compiler terminal */}
            <div className="bg-slate-950 rounded-xl p-3 border border-white/5 text-left font-mono text-[10px] text-emerald-400 flex flex-col gap-1">
              <div className="flex items-center justify-between text-slate-500 border-b border-white/5 pb-1 mb-1">
                <span>Output Console</span>
                <span className="text-[9px] text-[#06b6d4]">success</span>
              </div>
              <div>$ npx install_applet_package &ldquo;roj-compiler-v2&rdquo;</div>
              <div className="text-slate-400">[info] Sandboxed iframe environment injected.</div>
              <div className="text-cyan-400">[render] Live preview: Hello World rendered in 4ms.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Responsive Stats Counter Node */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 border border-white/5 hover:border-white/10 transition-colors text-center sm:text-left">
              <div className={`p-3 rounded-xl ${stat.color} text-center`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-white">{stat.value}</div>
                <div className="text-[11px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Browse Courses Section */}
      <section id="tracks-grid" className="max-w-7xl mx-auto w-full px-4 sm:px-8 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="text-left">
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-white tracking-tight">
              Featured Specialization Tracks
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select an educational playlist module with structured YouTube videos and complete playground lessons.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search playlists or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#11111d] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaylists.map((p) => (
            <div 
              key={p.id}
              onClick={() => onExplorePlaylist(p)}
              className="group relative rounded-2xl glass-panel p-5 border border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-cyan-950/20 transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Highlight ribbon accent */}
              <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${p.accentColor} rounded-full`}></div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#06b6d4] tracking-wider mb-4">
                  <span className="uppercase">{p.category}</span>
                  <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">{p.totalVideos} videos</span>
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-400 transition-colors text-left">
                  {p.title}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed mt-2.5 text-left line-clamp-3">
                  {p.description}
                </p>
              </div>

              <div className="border-t border-white/5 mt-6 pt-4 flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1 hover:text-white transition-colors">
                  <Code className="h-4 w-4 text-cyan-400" /> Web Compiler
                </span>
                <span className="flex items-center gap-1 text-[#6366f1] group-hover:translate-x-1 transition-transform">
                  Begin Course <Play className="h-3 w-3 fill-current shrink-0" />
                </span>
              </div>
            </div>
          ))}

          {filteredPlaylists.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 font-mono text-xs">
              No matching specializations found. Try searching &lsquo;React&rsquo;, &lsquo;Node&rsquo;, or &lsquo;DSA&rsquo;!
            </div>
          )}
        </div>
      </section>

      {/* 4. Leaderboard Showcase Preview */}
      <section className="bg-gradient-to-b from-transparent to-[#0e0e1a]/80 py-12 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 text-left flex flex-col gap-4">
            <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider self-start border border-yellow-500/20">
              <Trophy className="h-3.5 w-3.5" /> Learner Leaderboard
            </div>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-white tracking-tight">
              Fuel Your Learning Journey with Active Competition
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Earn Experience Points (XP) for every video you complete. Keep up your active study schedule to climb the rankings, unlock achievements, maintain daily learning streaks, and stand out in the Roj Study network.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-[#0b0b14]/50 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-orange-500 text-xs font-mono font-bold uppercase">
                  <Flame className="h-4.5 w-4.5" /> Daily Streak
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Keep 3+ days active to double your completion XP scores.</p>
              </div>
              <div className="bg-[#0b0b14]/50 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono font-bold uppercase">
                  <Award className="h-4.5 w-4.5" /> Career Path
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Certified graduates can automatically unlock professional profiles.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#06b6d4] opacity-20 blur-xl"></div>
            <div className="relative glass-panel rounded-2xl p-5 border border-white/10">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest text-left mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                <span>Top Academy Performers</span>
                <span className="text-cyan-400">Weekly Update</span>
              </h3>

              <div className="flex flex-col gap-3">
                {[
                  { rank: 1, name: "Aarav Sharma", avatar: "Aarav", xp: "14,850 XP", streak: 18, color: "text-amber-400 border-amber-400/20 bg-amber-400/5" },
                  { rank: 2, name: "Priya Patel", avatar: "Priya", xp: "12,400 XP", streak: 12, color: "text-slate-300 border-slate-300/20 bg-slate-300/5" },
                  { rank: 3, name: "Kabir Singh", avatar: "Kabir", xp: "11,950 XP", streak: 9, color: "text-amber-600 border-amber-600/20 bg-amber-600/5" }
                ].map((user) => (
                  <div key={user.rank} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${user.color}`}>
                        {user.rank}
                      </div>
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full border border-white/5 bg-slate-950 shrink-0" 
                      />
                      <div className="text-left">
                        <h4 className="text-xs font-semibold text-white">{user.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">Streak: {user.streak} days 🔥</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/30">
                      {user.xp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs Section */}
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-8 text-left flex flex-col gap-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-cyan-950/50 text-[#06b6d4] border border-cyan-800/10 mb-2">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 mt-1">Everything you need to know about the Roj Study interactive learning curriculum.</p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="glass-panel border border-white/5 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-xs sm:text-sm text-slate-200 hover:text-white transition-colors cursor-pointer focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transform transition-transform shrink-0 ml-4 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
