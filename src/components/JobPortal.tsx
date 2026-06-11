import React, { useState } from "react";
import { 
  Briefcase, UploadCloud, Timer, Star, CheckCircle, 
  ArrowUpRight, ChevronLeft, ShieldCheck, ClipboardList, 
  FileText, ArrowDown, ExternalLink, HelpCircle
} from "lucide-react";

interface JobPortalProps {
  onBack?: () => void;
}

export default function JobPortal({ onBack }: JobPortalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const futureJobs = [
    { 
      title: "Junior Full Stack React Developer", 
      field: "Frontend Engineering", 
      salary: "₹6,00,000 - ₹8,50,000 PA", 
      match: "React Mastery Course Completers", 
      badges: ["React", "Tailwind CSS", "Vite", "TypeScript"],
      description: "Join our active scaling web application development team. Focus on crafting high-performance user interfaces, handling responsive fluid grids, and styling interactive frontend elements seamlessly.",
      steps: [
        "Create a clean GitHub portfolio highlighting 3+ fully responsive React applications styled with Tailwind.",
        "Include live host URLs (e.g. Vercel, Netlify) directly inside your resume header.",
        "Ensure solid understanding of modern React state patterns, custom hook design, and virtual DOM lifecycle optimization.",
        "Submit your pre-registered verified certificate from Roj Study's React Course track directly to skip initial filters.",
        "Clear the 45-minute live technical screen covering component structure, async data fetching, and CSS layout algorithms."
      ]
    },
    { 
      title: "Junior Backend REST Engineer", 
      field: "Node.js & API Services", 
      salary: "₹7,20,000 - ₹9,80,000 PA", 
      match: "Backend Specialization Graduates", 
      badges: ["Node.js", "Express", "MongoDB", "SQL"],
      description: "Own database engineering schema definitions, configure robust RESTful and GraphQL endpoints, implement JWT authorization layers, and scale microservices architecture.",
      steps: [
        "Prepare live verified Postman collection URLs or Swagger documentation links of your custom API setups.",
        "Design standard relational databases using proper normalization, foreign constraint keys, and secondary indexing indices.",
        "Apply with a resume showcasing secure authentication systems, JSON Web Token flows, and password-hashing implementations.",
        "Receive the automated coding assessment: build a secure middleware proxy with Express within 60 minutes.",
        "Undertake the final round interview focusing on query performance, server scaling bounds, and system reliability."
      ]
    },
    { 
      title: "Generative AI Application Architect", 
      field: "AI Application Integrations", 
      salary: "₹10,50,000 - ₹14,00,000 PA", 
      match: "Generative AI Track Completers", 
      badges: ["Gemini API", "LLMs", "Node.js", "Prompt Engineering"],
      description: "Architect products integrated with generative models, balance prompt optimization layers, design vector database retrievals, and supervise semantic searches.",
      steps: [
        "Prepare code repositories showing functional calls to Google DeepMind Gemini API or equivalent SDK structures.",
        "Demonstrate deep comprehension regarding rate-limiting handles, token budget limits, and context-window compression systems.",
        "Apply showcasing production experience with text-to-image pipeline controls, multi-turn chat memory structures, or RAG frameworks.",
        "Demonstrate functional prompt safety filters, system instruction limits, and JSON schema schema enforcement.",
        "Undergo the panel interview covering real-time context streaming optimization, semantic indexing, and AI application constraints."
      ]
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSuccessMsg(`Successfully registered candidate file: ${e.dataTransfer.files[0].name}. We'll test compatibility upon launch!`);
    }
  };

  return (
    <div className="w-full text-left max-w-6xl mx-auto py-4 flex flex-col gap-6 font-sans select-none px-4">
      {onBack && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-cyan-500 hover:text-white font-mono font-bold tracking-wider transition-all group bg-slate-900 border border-white/5 hover:border-cyan-500/30 px-4 py-2 rounded-xl cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>BACK TO DASHBOARD</span>
          </button>
        </div>
      )}
      
      {/* Visual Splash Page */}
      <div className="relative glass-panel rounded-2xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 h-auto overflow-hidden">
        {/* Glow effect vector */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-amber-500/10 blur-[80px]" />
        
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Timer className="h-4 w-4 animate-pulse" /> SDE PLACEMENT SYSTEM ACTIVE
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            Connect Certifications <br />
            <span className="bg-gradient-to-r from-amber-600 via-indigo-500 to-cyan-500 dark:from-amber-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
              With Global SDE Employers.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed mt-4 max-w-xl">
            Our specialized <span className="font-semibold text-slate-800 dark:text-white">Roj Study Job Hub</span> bridges your certified learning directly into direct-apply tracks. Elevate your learning, build real proof of work, and follow our step-by-step preparation roadmaps.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 border-t border-slate-200 dark:border-white/5 pt-6 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Vetted SDE Portfolios</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Resume Score Check</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Verified Course Matching</span>
          </div>
        </div>

        {/* Upload candidate CV */}
        <div className="w-full lg:w-96 shrink-0 relative bg-white/50 dark:bg-slate-950/20 rounded-2xl">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              dragActive 
                ? "border-amber-400 bg-amber-950/10" 
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-705 bg-white/40 dark:bg-slate-950/40"
            }`}
          >
            <UploadCloud className="h-10 w-10 text-amber-500 mx-auto" />
            <h4 className="text-xs font-semibold text-slate-800 dark:text-white mt-3.5">Submit Resume for Review</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
              Drag &amp; drop your resume (PDF) to register into our student directory reviewed directly by sourcing recruiters.
            </p>

            <label className="inline-block mt-4 bg-slate-900 border border-white/10 hover:border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-[10px] font-mono cursor-pointer transition-colors">
              Browse Document
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSuccessMsg(`Successfully registered candidate file: ${e.target.files[0].name}. Splicing profiles now!`);
                  }
                }}
              />
            </label>

            {successMsg && (
              <div className="mt-3 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono leading-tight bg-emerald-50 dark:bg-emerald-950/40 p-2 border border-emerald-500/20 rounded-lg">
                {successMsg}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid displaying the current jobs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Job Cards Grid */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <div className="text-left">
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">Direct Application Openings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Expand any posting to reveal the strict step-by-step application pipeline model.</p>
          </div>

          <div className="flex flex-col gap-4">
            {futureJobs.map((job, i) => {
              const isSelected = selectedJob === i;
              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedJob(i)}
                  className={`glass-panel p-5 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isSelected 
                      ? "border-amber-500 ring-1 ring-amber-500/20 bg-slate-50 dark:bg-slate-900/40 translate-x-1" 
                      : "border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-3">
                      <span className="text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wide">{job.field}</span>
                      <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-bold">{job.salary}</span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {job.title}
                    </h4>
                    
                    <div className="bg-amber-500/10 border border-amber-500/15 rounded-lg p-2 mt-4 flex items-start gap-1.5">
                      <Star className="h-3 w-3 text-amber-500 mt-0.5 shrink-0 fill-current" />
                      <p className="text-[9px] text-amber-600 dark:text-amber-300 font-bold uppercase tracking-wider leading-relaxed">
                        Course Match: {job.match}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-250 dark:border-white/5 mt-5 pt-3.5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {job.badges.map((b) => (
                        <span key={b} className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-mono text-[9px] py-0.5 px-2 rounded">
                          {b}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Pipeline View &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Step-by-Step Instruction Pipeline Details */}
        <div className="md:col-span-6 flex flex-col gap-4">
          {selectedJob !== null ? (
            (() => {
              const job = futureJobs[selectedJob];
              return (
                <div className="glass-panel p-6 border border-amber-500/20 rounded-2xl bg-white dark:bg-slate-950/80 shadow-2xl relative overflow-hidden flex flex-col gap-4 text-left transition-all">
                  
                  <div className="absolute right-4 top-4 opacity-[0.03] select-none pointer-events-none">
                    <Briefcase className="h-20 w-20 text-slate-400" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                      Job Sourcing SDE Track
                    </span>
                    <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white mt-1 leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">{job.field} | {job.salary}</p>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs mb-1 font-mono uppercase tracking-wider">Role Summary:</h5>
                    <p>{job.description}</p>
                  </div>

                  {/* STEP-BY-STEP PROCESS FOR APPLYING */}
                  <div className="mt-2 text-left">
                    <div className="flex items-center gap-2 mb-3.5 border-b border-slate-100 dark:border-white/5 pb-2">
                      <ClipboardList className="h-4 w-4 text-amber-500 animate-bounce" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Step-by-Step APPLYING PROCESS:</h4>
                    </div>

                    <div className="space-y-4">
                      {job.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start group">
                          <div className="w-5.5 h-5.5 rounded-full shrink-0 flex items-center justify-center text-[10.5px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans font-medium">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practice action helper box */}
                  <div className="border border-dashed border-amber-500/20 bg-amber-500/5 p-4 rounded-xl text-left mt-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mb-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Roj Study Verified Application</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350 font-sans">
                      Completing the corresponding curriculum tracks on this platform automatically stamps verification credentials. Recruiting companies will observe your verified completion metrics directly!
                    </p>
                  </div>

                  {/* Apply CTA triggers */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => alert("Verification check: Resume has been added to priority tracking directory. Make sure to complete relevant courses to stamp verified badge!")}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-indigo-600 text-white font-sans font-bold text-xs py-3.5 px-4 rounded-xl hover:from-amber-700 hover:to-indigo-700 transition-colors cursor-pointer text-center"
                    >
                      SUBMIT PLACEMENT FILE
                    </button>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 font-mono text-xs py-3.5 px-4 rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                </div>
              );
            })()
          ) : (
            <div className="glass-panel p-6 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl bg-white/20 dark:bg-slate-950/10 text-center flex flex-col items-center justify-center py-16 min-h-[360px]">
              <FileText className="h-10 w-10 text-amber-500/20 mb-3" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Application SDE Blueprint</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed mx-auto">
                Select any open premium developer position in the grid to view role summary requirements, step-by-step applying processes, and verified shortlisting metrics.
              </p>
            </div>
          )}

          {/* HR PREPARATION STRATEGY PLACEMENT PACK */}
          <div className="glass-panel p-5 border border-white/5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/20 text-left">
            <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">SDE Sourcing Preparation Pack:</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-normal">
              <li className="flex items-start gap-1.5"><strong className="text-slate-800 dark:text-slate-200">1. Proof of Work FIRST:</strong> Build actual, cloned functional repositories demonstrating complex database setups instead of basic simple templates.</li>
              <li className="flex items-start gap-1.5"><strong className="text-slate-800 dark:text-slate-200">2. Solve compiler errors:</strong> Practicing on Roj Study's built-in sandbox prepares you to handle strict compiler requirements.</li>
              <li className="flex items-start gap-1.5"><strong className="text-slate-800 dark:text-slate-200">3. Perfect Big-O handles:</strong> Do not submit code featuring nested dual-loops unless required; optimize for minimum spatial / memory latency scores.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
