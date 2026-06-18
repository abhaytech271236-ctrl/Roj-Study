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
      <section className="relative overflow-hidden pt-12 md:pt-24 pb-6 px-4 sm:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Sleek cyber ambient gradients */}
        <div className="absolute right-0 top-10 -z-10 w-[500px] h-[500px] rounded-full bg-[#1b61f3]/15 blur-[120px] pointer-events-none"></div>
        <div className="absolute left-10 bottom-10 -z-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none"></div>

        {/* Left text column */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-left animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-[#1b61f3]/5 border border-[#1b61f3]/25 rounded-full py-1.5 px-4 text-[10px] font-bold tracking-widest text-[#1b61f3] uppercase self-start font-mono">
            <Sparkles className="h-3.5 w-3.5 text-[#1b61f3] animate-pulse shrink-0" />
            <span>ROZ STUDY DIGITAL HUB</span>
          </div>

          <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] uppercase select-none">
            WE CREATE <br />
            <span className="text-[#1b61f3] drop-shadow-[0_0_25px_rgba(27,97,243,0.35)] font-extrabold">
              DIGITAL SOLUTIONS
            </span> <br />
            THAT INSPIRE
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg font-sans">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Discover custom-curated software playlists, live web-compilers, and automated career credentials.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4">
            <button
              onClick={onBeginLearning}
              className="px-10 py-4 bg-[#1b61f3] hover:bg-[#1350d1] text-white font-bold text-xs sm:text-sm tracking-widest rounded-lg shadow-lg shadow-blue-500/20 uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer font-sans text-center"
            >
              GET STARTED
            </button>
            <button
              onClick={() => {
                const specSection = document.getElementById("tracks-grid");
                specSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-4 bg-slate-950/40 hover:bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white font-semibold text-xs sm:text-sm tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-sans text-center"
            >
              <Play className="h-4 w-4 text-indigo-400 shrink-0 fill-indigo-400/20" />
              EXPLORE MODULES
            </button>
          </div>

          {/* Core system flags */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-white/5 mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-[#1b61f3]" /> Fully Responsive UI</span>
            <span className="flex items-center gap-1.5"><Code className="h-4 w-4 text-[#1b61f3]" /> Real-Time Sandbox</span>
            <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-[#1b61f3]" /> Automated Certificates</span>
          </div>
        </div>

        {/* Right graphical visualization column with beautiful angled masks & overlapping shapes */}
        <div className="lg:col-span-6 relative aspect-[4/3] w-full min-h-[300px] sm:min-h-[400px] select-none hover:scale-[1.01] transition-transform duration-500">
          
          {/* Subtle outer tech coordinate frame */}
          <div className="absolute inset-0 bg-[#1b61f3]/5 rounded-3xl border border-white/5 -z-10"></div>
          
          {/* Fine cyberline coordinate accents */}
          <div className="absolute left-[5%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#1b61f3]/0 via-[#1b61f3]/45 to-[#1b61f3]/0"></div>
          <div className="absolute left-[35%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#1b61f3]/0 via-[#1b61f3]/25 to-[#1b61f3]/0"></div>
          
          <div className="absolute right-[10%] left-[10%] top-[40%] h-[1px] bg-[#1b61f3]/15"></div>

          {/* 1. Underlying semi-transparent dark-blue skewed stripe (Overlap Layer B) */}
          <div 
            className="absolute right-0 bottom-[10%] w-[85%] h-[35%] bg-gradient-to-r from-blue-900/10 via-blue-600/30 to-blue-600/15 backdrop-blur-sm -z-[5]"
            style={{
              clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)"
            }}
          ></div>

          {/* 2. Main angled skyscraper layout clip mask */}
          <div 
            className="absolute right-0 top-0 w-[78%] h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl"
            style={{
              clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)"
            }}
          >
            {/* Elegant high-rise modernist glass corporate building image matching the blue palette */}
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" 
              alt="Futuristic skyscraper solutions" 
              className="absolute inset-0 w-full h-full object-cover opacity-85 hover:scale-105 transition-all duration-1000 brightness-110"
              referrerPolicy="no-referrer"
            />
            
            {/* Cyber glass tint gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#090a0f] via-transparent to-blue-500/10 pointer-events-none"></div>
          </div>

          {/* 3. Solid vibrant neon blue triangular geometry overlapping the slice (Overlap Layer A) */}
          <div 
            className="absolute left-[20%] top-[30%] w-[42%] h-[40%] bg-[#1b61f3] shadow-lg shadow-blue-600/40 opacity-95 hover:opacity-100 transition-opacity"
            style={{
              clipPath: "polygon(100% 0%, 0% 50%, 100% 100%)"
            }}
          >
            {/* Light ambient glare inside triangle */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
          </div>

          {/* Outer graphic accent lines mimicking architect guidelines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none text-blue-500/50" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="80" y1="90" x2="280" y2="40" stroke="currentColor" strokeWidth="0.75" travel-line="true" />
            <line x1="120" y1="120" x2="320" y2="70" stroke="currentColor" strokeWidth="0.5" />
          </svg>
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

      {/* 2.5 Real-Time Online Code Compiler & Tutorial Playpen Highlight */}
      <section className="relative overflow-hidden py-4 max-w-7xl mx-auto w-full px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Glow behind the highlights */}
        <div className="absolute left-[30%] top-[20%] -z-10 w-96 h-96 rounded-full bg-[#1b61f3]/10 blur-[130px] pointer-events-none"></div>

        <div className="lg:col-span-6 text-left flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-[#1b61f3]/5 border border-[#1b61f3]/25 rounded-full py-1 px-3 text-[10px] font-bold tracking-widest text-[#1b61f3] uppercase self-start font-mono">
            <Code className="h-3.5 w-3.5" />
            <span>Interactive Workspace</span>
          </div>

          <h2 className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
            LEARN BY BUILDING, <br />
            <span className="text-[#1b61f3] drop-shadow-[0_0_15px_rgba(27,97,243,0.25)]">NOT JUST WATCHING</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl font-sans">
            Roj Study completely bridges the gap between passive video tutorials and active coding development. Every specialized playlist includes an integrated multi-tab compiler to practice what you learn in real-time.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/15 text-[#1b61f3] mt-0.5 shrink-0 font-mono text-[10px] font-bold">
                01
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Full-Stack HTML/CSS/JS Sandbox</h4>
                <p className="text-xs text-slate-400 mt-0.5">Write syntax and scripts synchronously next to the high-definition video lesson without dual monitors.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/15 text-[#1b61f3] mt-0.5 shrink-0 font-mono text-[10px] font-bold">
                02
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Console Output Log Terminal</h4>
                <p className="text-xs text-slate-400 mt-0.5">Track exceptions, runtime values, and standard document actions in simulated developer environments.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/15 text-[#1b61f3] mt-0.5 shrink-0 font-mono text-[10px] font-bold">
                03
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Saved Progress & Scoring</h4>
                <p className="text-xs text-slate-400 mt-0.5">Your watch histories, bookmarks, code playgrounds, and score histories are securely backed up automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero visual mock banner - Esko bhi scale & align karke clean frame me rkh diya */}
        <div className="lg:col-span-6 relative w-full h-full">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#1b61f3] via-blue-600 to-indigo-500 opacity-15 blur-2xl"></div>
          <div className="relative bg-[#0d0d17]/90 rounded-2xl p-5 border border-white/5 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-1.5 select-none">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">rojstudy_compiler.tsx</span>
            </div>

            {/* Simulated Live Player Preview */}
            <div className="relative bg-black/60 aspect-video rounded-xl overflow-hidden border border-white/5 flex items-center justify-center group">
              <img 
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop" 
                alt="Workspace preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-750" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 py-3 flex flex-col justify-between text-left">
                <div className="bg-[#1b61f3]/90 py-0.5 px-2 rounded text-[9px] font-bold text-white self-start border border-[#1b61f3]/20 uppercase tracking-widest font-mono">
                  Interactive Compiler Live
                </div>
                <div>
                  <h4 className="text-[10px] font-mono text-[#505f73] uppercase tracking-wider">Playing Now:</h4>
                  <p className="text-xs font-bold text-white truncate">React Custom Hooks & Component Architecture</p>
                </div>
              </div>
              <div className="z-10 bg-[#1b61f3] hover:bg-[#1350d1] h-12 w-12 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer group-hover:scale-110 active:scale-95 transition-all">
                <Play className="h-5 w-5 fill-white" />
              </div>
            </div>

            {/* Simulating compiler terminal */}
            <div className="bg-[#07070e] rounded-xl p-3.5 border border-white/5 text-left font-mono text-[10px] text-cyan-400 flex flex-col gap-1.5 shadow-inner">
              <div className="flex items-center justify-between text-slate-500 border-b border-white/5 pb-1.5 mb-1 select-none">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#505f73]">Console Output</span>
                <span className="text-[9px] text-[#22c55e] font-bold">SUCCESS</span>
              </div>
              <div className="text-slate-400">$ npx install_applet_package &ldquo;roj-playground-sandbox&rdquo;</div>
              <div className="text-slate-500">[info] Sandboxed secure iframe layer initialized safely.</div>
              <div className="text-[#10b981] font-semibold">[render] Live preview: Custom sandbox index.html rendered successfully in 3ms.</div>
            </div>
          </div>
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
